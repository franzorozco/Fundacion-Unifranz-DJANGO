from rest_framework import serializers
from .models import Donation, DonationItem, DonationImage, DonationTracking
from campaigns.models import Campaign
from django.contrib.auth import get_user_model

User = get_user_model()


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ["id", "title"]


class DonationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationItem
        fields = "__all__"


class DonationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationImage
        fields = ["id", "image"]


class DonationTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationTracking
        fields = "__all__"


class DonationSerializer(serializers.ModelSerializer):

    donor = DonorSerializer(read_only=True)
    campaign = CampaignSerializer(read_only=True)

    items = DonationItemSerializer(many=True, read_only=True)
    images = DonationImageSerializer(many=True, read_only=True)
    tracking = DonationTrackingSerializer(many=True, read_only=True)

    class Meta:
        model = Donation
        fields = [
            "id",
            "donor",
            "campaign",
            "destination_type",
            "status",
            "money_amount",
            "notes",
            "created_at",
            "items",
            "images",
            "tracking",
        ]