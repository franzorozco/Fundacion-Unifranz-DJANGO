from rest_framework import viewsets
from django.shortcuts import redirect

from .models import Donacion
from .serializers import DonacionSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from campaigns.models import ActivityVolunteer
from donations.models import Donation, DonationItem, DonationTracking


# 🔹 VIEWSET DONACIONES
class DonacionViewSet(viewsets.ModelViewSet):
    queryset = Donacion.objects.all()
    serializer_class = DonacionSerializer
    permission_classes = [AllowAny]


# 🔹 REDIRECCIÓN AL FRONT
def redirect_to_frontend(request):
    return redirect("http://localhost:3000/social-success/")


# 🔹 LOGIN SOCIAL (JWT)
@api_view(['GET'])
def social_login_success(request):
    if request.user.is_authenticated:
        refresh = RefreshToken.for_user(request.user)

        return Response({
            "access": str(refresh.access_token),
        })

    return Response({"error": "No autenticado"}, status=401)

class MyActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        donations = Donation.objects.filter(donor=user).select_related("campaign")

        activities = ActivityVolunteer.objects.filter(
            user=user
        ).select_related("activity", "activity__campaign")

        return Response({
            "donations": [
                {
                    "id": d.id,
                    "campaign": d.campaign.title if d.campaign else "Sin campaña",
                    "status": d.status,
                    "money_amount": d.money_amount,
                    "created_at": d.created_at,
                    "items": [
                        {
                            "name": i.name,
                            "quantity": i.quantity
                        } for i in d.items.all()
                    ]
                }
                for d in donations
            ],

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