from django.urls import path
from . import views

urlpatterns = [
    # crear donación
    path("donations/", views.api_create_donation),

    # donaciones de un usuario
    path("users/<int:user_id>/donations/", views.api_user_donations),

    # donaciones de campaña
    path("campaigns/<int:campaign_id>/donations/", views.api_campaign_donations),

    # actualizar estado
    path("donations/<int:donation_id>/status/", views.api_update_status),

    # valor donación
    path("donations/<int:donation_id>/value/", views.api_donation_value),

    # resumen campaña
    path("campaigns/<int:campaign_id>/summary/", views.api_campaign_summary),
]