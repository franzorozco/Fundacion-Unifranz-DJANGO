from rest_framework import serializers
from .models import Campaign, CampaignActivity, ActivityLocation, ActivitySkillRequirement, ActivityVolunteer
from users.models import Skill
from users.serializers import UserSerializer

# =========================
# VOLUNTEER (DEBE IR PRIMERO)
# =========================
class ActivityVolunteerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ActivityVolunteer
        fields = "__all__"


# =========================
# SKILL REQUIREMENT
# =========================
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
    volunteers = ActivityVolunteerSerializer(many=True, read_only=True)

    class Meta:
        model = CampaignActivity
        fields = "__all__"


# =========================
# CAMPAIGN
# =========================


class CampaignSerializer(serializers.ModelSerializer):
    total_volunteers = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = "__all__"

    def get_total_volunteers(self, obj):
        return ActivityVolunteer.objects.filter(
            activity__campaign=obj,
            status="approved"  # o applied si quieres total postulados
        ).count()