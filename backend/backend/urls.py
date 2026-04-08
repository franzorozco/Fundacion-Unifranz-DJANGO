from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import HttpResponse

from core.views import DonacionViewSet, social_login_success

from django.conf import settings
from django.conf.urls.static import static

from users.views import (
    UserViewSet,
    RoleViewSet,
    SkillViewSet,
    UserSkillViewSet,
    VolunteerProfileViewSet
)

router = DefaultRouter()
router.register(r'donaciones', DonacionViewSet)
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'user-skills', UserSkillViewSet)
router.register(r'profiles', VolunteerProfileViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    path('social-login-success/', social_login_success),

    path('api/users/me/', include('users.urls')),
    path('api/', include(router.urls)),
    path('dashboard/', lambda request: HttpResponse("Usuario autenticado")),
]