from rest_framework import serializers
from .models import Donation, DonationItem


class DonationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationItem
        fields = "__all__"


class DonationSerializer(serializers.ModelSerializer):
    items = DonationItemSerializer(many=True, read_only=True)
    images = DonationImageSerializer(many=True, read_only=True)
    class Meta:
        model = Donation
        fields = "__all__"

class DonationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationImage
        fields = "__all__"