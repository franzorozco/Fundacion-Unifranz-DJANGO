# backend/signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Role
from django.apps import apps

@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    if sender.name == "backend":  # nombre de tu app
        default_roles = ["Admin", "Coordinador", "Voluntario", "Donante", "Invitado"]
        for role_name in default_roles:
            Role.objects.get_or_create(name=role_name)