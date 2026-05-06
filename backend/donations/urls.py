from django.urls import path
from . import views

urlpatterns = [
    path("donations/", views.api_create_donation, name="create_donation"),
    path("donations/all/", views.api_all_donations, name="all_donations"),
    path("users/<int:user_id>/donations/", views.api_user_donations),
    path("campaigns/<int:campaign_id>/donations/", views.api_campaign_donations),
    path("donations/<int:donation_id>/status/", views.api_update_status),
    path("donations/<int:pk>/", views.DonationDetailView.as_view()),
]