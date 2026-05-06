from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView

from .models import Donation, DonationItem, DonationImage
from campaigns.models import ActivityVolunteer
from .serializers import DonationSerializer

from .services import (
    get_donations_by_user,
    get_donations_by_campaign,
    update_donation_status,
    calculate_donation_value,
    get_campaign_donation_summary
)

import json


# =========================
# DETAIL DONATION
# =========================
class DonationDetailView(RetrieveAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer


# =========================
# CREATE DONATION
# =========================
@api_view(["POST"])
def api_create_donation(request):

    try:
        data = request.data
        items = data.get("items", [])
        files = request.FILES.getlist("images")

        if isinstance(items, str):
            items = json.loads(items)

        donation = Donation.objects.create(
            donor_id=data.get("donor_id"),
            destination_type=data.get("destination_type"),
            campaign_id=data.get("campaign_id"),
            money_amount=data.get("money_amount") or 0,
            notes=data.get("notes") or ""
        )

        for item in items:
            DonationItem.objects.create(
                donation=donation,
                name=item.get("name"),
                quantity=item.get("quantity", 1),
                condition=item.get("condition", "good")
            )

        for file in files:
            DonationImage.objects.create(
                donation=donation,
                image=file
            )

        return Response(DonationSerializer(donation).data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# =========================
# ALL DONATIONS
# =========================
@api_view(["GET"])
def api_all_donations(request):

    donations = Donation.objects.all().order_by("-created_at")
    return Response(DonationSerializer(donations, many=True).data)


# =========================
# USER DONATIONS
# =========================
@api_view(["GET"])
def api_user_donations(request, user_id):

    donations = Donation.objects.filter(donor_id=user_id).order_by("-created_at")
    return Response(DonationSerializer(donations, many=True).data)


# =========================
# CAMPAIGN DONATIONS
# =========================
@api_view(["GET"])
def api_campaign_donations(request, campaign_id):

    donations = Donation.objects.filter(campaign_id=campaign_id)
    return Response(DonationSerializer(donations, many=True).data)


# =========================
# UPDATE STATUS
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
# DONATION VALUE
# =========================
@api_view(["GET"])
def api_donation_value(request, donation_id):

    value = calculate_donation_value(donation_id)
    return Response({"total_value": value})


# =========================
# CAMPAIGN SUMMARY
# =========================
@api_view(["GET"])
def api_campaign_summary(request, campaign_id):

    summary = get_campaign_donation_summary(campaign_id)
    return Response(summary)


# =========================
# MY ACTIVITY
# =========================
class MyActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        donations = Donation.objects.filter(donor=user)
        activities = ActivityVolunteer.objects.filter(user=user)

        return Response({
            "donations": DonationSerializer(donations, many=True).data,
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