from rest_framework import viewsets
from django.shortcuts import redirect
from django.http import HttpResponse

from .models import Donacion
from .serializers import DonacionSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


# 🔹 VIEWSET
class DonacionViewSet(viewsets.ModelViewSet):
    queryset = Donacion.objects.all()
    serializer_class = DonacionSerializer


# 🔹 REDIRECT DESPUÉS DE LOGIN (ALLAUTH)
def redirect_to_frontend(request):
    return redirect("http://localhost:3000/social-success/")


# 🔹 GENERAR JWT DESPUÉS DE GOOGLE LOGIN
@api_view(['GET'])
def social_login_success(request):
    if request.user.is_authenticated:
        refresh = RefreshToken.for_user(request.user)

        return Response({
            "access": str(refresh.access_token),
        })

    return Response({"error": "No autenticado"}, status=401)

