from rest_framework import viewsets, permissions

from .models import Campaign, CampaignActivity
from .serializers import CampaignSerializer, CampaignActivitySerializer, ActivityLocationSerializer, ActivityLocation
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
from .models import ActivitySkillRequirement
from .serializers import ActivityVolunteerSerializer
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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        campaign_id = request.data.get("campaign")

        if not campaign_id:
            return Response({"error": "campaign requerido"}, status=400)

        try:
            campaign = Campaign.objects.get(id=campaign_id)
        except Campaign.DoesNotExist:
            return Response({"error": "campaign no existe"}, status=404)

        activity = CampaignService.add_activity(campaign, request.data.copy())

        serializer = self.get_serializer(activity)
        return Response(serializer.data, status=201)



class CampaignActivityViewSet(viewsets.ModelViewSet):
    queryset = CampaignActivity.objects.all()
    serializer_class = CampaignActivitySerializer


class ActivityLocationViewSet(viewsets.ModelViewSet):
    queryset = ActivityLocation.objects.all()
    serializer_class = ActivityLocationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class ActivityVolunteerViewSet(viewsets.ModelViewSet):
    queryset = ActivityVolunteer.objects.select_related("user", "activity").all()
    serializer_class = ActivityVolunteerSerializer
    permission_classes = [IsAuthenticated]

@api_view(["GET"])
def activities_map(request):
    activities = CampaignActivity.objects.select_related("location").all()
    serializer = CampaignActivitySerializer(activities, many=True)
    return Response(serializer.data)


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


@api_view(["POST", "PUT"])
@permission_classes([IsAuthenticated])
def activity_location(request, pk):
    activity = get_object_or_404(CampaignActivity, pk=pk)

    location = CampaignService.set_location(activity, request.data)

    return Response({
        "message": "Ubicación guardada",
        "location_id": location.id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def activity_skills(request, pk):
    activity = get_object_or_404(CampaignActivity, pk=pk)

    skills = request.data.get("skills", [])

    # limpiar
    ActivitySkillRequirement.objects.filter(activity=activity).delete()

    for s in skills:
        ActivitySkillRequirement.objects.create(
            activity=activity,
            skill_id=s["skill_id"],
            required_level=s.get("required_level", 50),
            is_mandatory=s.get("is_mandatory", True),
        )

    return Response({"message": "Skills guardadas"})