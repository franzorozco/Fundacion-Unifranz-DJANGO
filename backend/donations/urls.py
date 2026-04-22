from django.urls import path
from . import views

urlpatterns = [
    # crear donación
    path("donations/", views.api_create_donation, name="create_donation"),

    # LISTAR TODAS (IMPORTANTE: cambia URL)
    path("donations/all/", views.api_all_donations, name="all_donations"),

    # usuario
    path("users/<int:user_id>/donations/", views.api_user_donations),

    # campaña
    path("campaigns/<int:campaign_id>/donations/", views.api_campaign_donations),

    # status
    path("donations/<int:donation_id>/status/", views.api_update_status),
]