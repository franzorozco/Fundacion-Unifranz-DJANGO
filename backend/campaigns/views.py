from rest_framework import viewsets, permissions

from .models import Campaign, CampaignActivity
from .serializers import CampaignSerializer, CampaignActivitySerializer
from .services.campaign_service import CampaignService
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import CampaignActivity, ActivityVolunteer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from donations.models import Donation, DonationItem
 
class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["get"])
    def activities(self, request, pk=None):
        activities = CampaignActivity.objects.filter(campaign_id=pk)
        serializer = CampaignActivitySerializer(activities, many=True)
        return Response(serializer.data)

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = CampaignActivity.objects.all()
    serializer_class = CampaignActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        campaign_id = self.request.data.get("campaign")
        campaign = Campaign.objects.get(id=campaign_id)

        CampaignService.add_activity(campaign, self.request.data)





@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_to_activity(request, pk):
    activity = get_object_or_404(CampaignActivity, id=pk)

    volunteer, created = ActivityVolunteer.objects.get_or_create(
        activity=activity,
        user=request.user,
        defaults={
            "status": ActivityVolunteer.Status.APPLIED
        }
    )

    if not created:
        return Response(
            {"message": "Ya estás postulado a esta actividad"},
            status=400
        )

    return Response({"message": "Postulación exitosa"})