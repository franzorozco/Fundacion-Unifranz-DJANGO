from campaigns.models import Campaign, CampaignActivity, ActivityLocation, ActivitySkillRequirement

class CampaignService:

    # =========================
    # CAMPAIGN CRUD
    # =========================
    @staticmethod
    def create_campaign(user, data):
        return Campaign.objects.create(
            created_by=user,
            **data
        )

    @staticmethod
    def update_campaign(campaign, data):
        for key, value in data.items():
            setattr(campaign, key, value)
        campaign.save()
        return campaign

    @staticmethod
    def delete_campaign(campaign):
        campaign.delete()

    @staticmethod
    def get_campaign(campaign_id):
        return Campaign.objects.get(id=campaign_id)

    @staticmethod
    def list_campaigns():
        return Campaign.objects.all()


    # =========================
    # ACTIVITIES
    # =========================
    @staticmethod
    def add_activity(campaign, data):
        skills = data.pop("skills", [])
        location_data = data.pop("location", None)

        activity = CampaignActivity.objects.create(
            campaign=campaign,
            **data
        )

        # 🔥 GUARDAR SKILLS
        for s in skills:
            ActivitySkillRequirement.objects.create(
                activity=activity,
                skill_id=s["skill"],
                required_level=s.get("required_level", 50),
                is_mandatory=s.get("is_mandatory", True),
            )

        # 📍 GUARDAR LOCATION
        if location_data:
            ActivityLocation.objects.create(
                activity=activity,
                **location_data
            )

        return activity

    @staticmethod
    def update_activity(activity, data):
        for key, value in data.items():
            setattr(activity, key, value)
        activity.save()
        return activity

    @staticmethod
    def delete_activity(activity):
        activity.delete()


    # =========================
    # LOCATION
    # =========================
    @staticmethod
    def set_location(activity, data):
        location, created = ActivityLocation.objects.get_or_create(
            activity=activity,
            defaults=data
        )

        if not created:
            for key, value in data.items():
                setattr(location, key, value)
            location.save()

        return location