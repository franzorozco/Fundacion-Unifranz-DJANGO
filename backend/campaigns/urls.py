from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    CampaignViewSet,
    ActivityViewSet,
    ActivityLocationViewSet,
    apply_to_activity,
    activities_map,
    CampaignActivityViewSet,
    activity_location,      # 👈 AGREGA ESTO
    activity_skills         # 👈 y este si también lo creaste
)
from .views import ActivityVolunteerViewSet
router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"activities", ActivityViewSet)
router.register(r"locations", ActivityLocationViewSet)
router.register(r"activity-volunteers", ActivityVolunteerViewSet)


urlpatterns = [
    path("", include(router.urls)),

    # extras funcionales
    path("activities/<int:pk>/apply/", apply_to_activity),
    path("activities-map/", activities_map),
    path("activities/<int:pk>/location/", activity_location),
    path("activities/<int:pk>/skills/", activity_skills),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
