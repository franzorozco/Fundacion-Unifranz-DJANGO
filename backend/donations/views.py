from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

import json

from .models import Donation, DonationItem
from campaigns.models import ActivityVolunteer
from .services import (
    get_donations_by_user,
    get_donations_by_campaign,
    update_donation_status,
    calculate_donation_value,
    get_campaign_donation_summary
)

# =========================
# CREAR DONACIÓN
# =========================
@api_view(["POST"])
def api_create_donation(request):

    data = request.data
    items = data.get("items", [])

    if isinstance(items, str):
        items = json.loads(items)

    donation = Donation.objects.create(
        donor_id=data["donor_id"],
        destination_type=data["destination_type"],
        campaign_id=data.get("campaign_id"),
        money_amount=data.get("money_amount"),
        notes=data.get("notes")
    )

    for item in items:
        DonationItem.objects.create(
            donation=donation,
            name=item.get("name"),
            quantity=item.get("quantity", 1),
            condition=item.get("condition", "good")
        )

    return Response({"ok": True, "donation_id": donation.id})


# =========================
# DONACIONES POR USUARIO
# =========================
@api_view(["GET"])
def api_user_donations(request, user_id):

    donations = get_donations_by_user(user_id)

    return Response({
        "user_id": user_id,
        "results": [
            {
                "id": d.id,
                "status": d.status,
                "created_at": d.created_at
            }
            for d in donations
        ]
    })


# =========================
# DONACIONES POR CAMPAÑA
# =========================
@api_view(["GET"])
def api_campaign_donations(request, campaign_id):

    donations = get_donations_by_campaign(campaign_id)

    return Response({
        "campaign_id": campaign_id,
        "results": [
            {
                "id": d.id,
                "donor": d.donor.email,
                "status": d.status
            }
            for d in donations
        ]
    })


# =========================
# ACTUALIZAR ESTADO
# =========================
@api_view(["PATCH"])
def api_update_status(request, donation_id):

    donation = update_donation_status(
        donation_id,
        request.data["status"],
        request.data.get("description")
    )

    return Response({
        "donation_id": donation_id,
        "status": donation.status
    })


# =========================
# VALOR DONACIÓN
# =========================
@api_view(["GET"])
def api_donation_value(request, donation_id):

    value = calculate_donation_value(donation_id)

    return Response({"total_value": value})


# =========================
# RESUMEN CAMPAÑA
# =========================
@api_view(["GET"])
def api_campaign_summary(request, campaign_id):

    summary = get_campaign_donation_summary(campaign_id)

    return Response(summary)


@api_view(["GET"])
def api_all_donations(request):
    donations = Donation.objects.all().order_by("-created_at")

    return Response([
        {
            "id": d.id,
            "donor": d.donor.email,
            "destination_type": d.destination_type,
            "status": d.status,
            "money_amount": d.money_amount,
            "created_at": d.created_at
        }
        for d in donations
    ])
    
# =========================
# ACTIVIDAD USUARIO
# =========================
class MyActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        donations = Donation.objects.filter(donor=user)

        activities = ActivityVolunteer.objects.filter(user=user)

        return Response({
            "donations": [
                {
                    "id": d.id,
                    "campaign": d.campaign.title if d.campaign else "Sin campaña",
                    "status": d.status,
                    "money_amount": d.money_amount,
                    "created_at": d.created_at,
                    "items": [
                        {
                            "name": i.name,
                            "quantity": i.quantity
                        } for i in d.donationitem_set.all()
                    ]
                }
                for d in donations
            ],

            "activities": [
                {
                    "id": a.id,
                    "activity": a.activity.title,
                    "campaign": a.activity.campaign.title,
                    "status": a.status,
                    "applied_at": a.applied_at
                }
                for a in activities
            ]
        })