from rest_framework import viewsets, permissions
from .models import Campaign, CampaignActivity
from .serializers import CampaignSerializer, CampaignActivitySerializer
from .services.campaign_service import CampaignService
from rest_framework.parsers import MultiPartParser, FormParser

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # 🔥 NECESARIO

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = CampaignActivity.objects.all()
    serializer_class = CampaignActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        campaign_id = self.request.data.get("campaign")
        campaign = Campaign.objects.get(id=campaign_id)

        CampaignService.add_activity(campaign, self.request.data)