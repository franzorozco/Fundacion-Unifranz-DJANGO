from rest_framework import serializers
from .models import Campaign, CampaignActivity, ActivityLocation
from .models import ActivitySkillRequirement
from users.models import Skill



class ActivitySkillRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivitySkillRequirement
        fields = "__all__"

        
# =========================
# LOCATION
# =========================
class ActivityLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLocation
        fields = "__all__"


# =========================
# ACTIVITY
# =========================
class CampaignActivitySerializer(serializers.ModelSerializer):
    location = ActivityLocationSerializer(read_only=True)
    skill_requirements = ActivitySkillRequirementSerializer(many=True, read_only=True)

    class Meta:
        model = CampaignActivity
        fields = "__all__"

# =========================
# CAMPAIGN
# =========================
class CampaignSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Campaign
        fields = "__all__"
        read_only_fields = ["created_by"]
