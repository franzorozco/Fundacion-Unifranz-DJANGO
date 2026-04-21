from django.db import transaction
from .models import Donation, DonationItem, DonationTracking
from campaigns.models import Campaign
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

User = get_user_model()


@transaction.atomic
def create_donation(
    donor_id,
    destination_type,
    items,
    campaign_id=None,
    money_amount=None,
    notes=None
):

    donor = get_object_or_404(User, id=donor_id)

    campaign = None

    if destination_type == "campaign":
        if not campaign_id:
            raise ValueError("campaign_id requerido")

        campaign = get_object_or_404(Campaign, id=campaign_id)

    donation = Donation.objects.create(
        donor=donor,
        destination_type=destination_type,
        campaign=campaign,
        money_amount=money_amount,
        notes=notes
    )

    total_value = 0

    for item in items:
        DonationItem.objects.create(
            donation=donation,
            name=item["name"],
            description=item.get("description"),
            quantity=item.get("quantity", 1),
            condition=item.get("condition", "good"),
            estimated_value=item.get("estimated_value")
        )

        if item.get("estimated_value"):
            total_value += float(item["estimated_value"]) * item.get("quantity", 1)

    DonationTracking.objects.create(
        donation=donation,
        event="created",
        description="Donación registrada en el sistema"
    )

    return donation
    

def get_donations_by_user(user_id):
    return Donation.objects.filter(donor_id=user_id).order_by("-created_at")

def get_donations_by_campaign(campaign_id):
    return Donation.objects.filter(campaign_id=campaign_id).order_by("-created_at")

def update_donation_status(donation_id, new_status, description=None):

    donation = Donation.objects.get(id=donation_id)
    donation.status = new_status
    donation.save()

    DonationTracking.objects.create(
        donation=donation,
        event=new_status,
        description=description or f"Estado cambiado a {new_status}"
    )

    return donation

def calculate_donation_value(donation_id):
    items = DonationItem.objects.filter(donation_id=donation_id)

    total = 0
    for item in items:
        if item.estimated_value:
            total += float(item.estimated_value) * item.quantity

    return total

def get_campaign_donation_summary(campaign_id):
    donations = Donation.objects.filter(campaign_id=campaign_id)

    total_money = sum([d.money_amount or 0 for d in donations])
    total_items = sum([d.items.count() for d in donations])

    return {
        "total_donations": donations.count(),
        "total_money": total_money,
        "total_items": total_items
    }