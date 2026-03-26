from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import social_login_success
from django.http import HttpResponse
from django.urls import path

from core.views import DonacionViewSet, redirect_to_frontend

router = DefaultRouter()
router.register(r'donaciones', DonacionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('social-login-success/', social_login_success),
    path('accounts/', include('allauth.urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    path('api/', include(router.urls)),

    path('dashboard/', lambda request: HttpResponse("Usuario autenticado")),

]