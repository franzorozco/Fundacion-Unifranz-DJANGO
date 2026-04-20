from django.urls import path
from .views import me

urlpatterns = [
    path('', me),
    path('me/', me),
]