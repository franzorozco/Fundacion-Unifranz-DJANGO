from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .views import CampaignViewSet, ActivityViewSet, apply_to_activity

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"activities", ActivityViewSet)

urlpatterns = [
    path("", include(router.urls)),

    # 🔥 AQUÍ VA TU ENDPOINT PERSONALIZADO
    path("activities/<int:pk>/apply/", apply_to_activity),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)