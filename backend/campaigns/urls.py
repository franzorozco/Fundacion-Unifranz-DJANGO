from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, ActivityViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"activities", ActivityViewSet)

# ✅ Primero definir
urlpatterns = router.urls

# ✅ Luego extender
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)