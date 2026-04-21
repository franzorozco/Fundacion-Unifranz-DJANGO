from django.db import models
from django.conf import settings
from campaigns.models import Campaign

User = settings.AUTH_USER_MODEL


class Donation(models.Model):

    class DonationStatus(models.TextChoices):
        PENDING = "pending", "Pendiente"
        RECEIVED = "received", "Recibida"
        DISTRIBUTED = "distributed", "Distribuida"
        CANCELLED = "cancelled", "Cancelada"

    class DestinationType(models.TextChoices):
        FOUNDATION = "foundation", "Fundación"
        CAMPAIGN = "campaign", "Campaña"

    donor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="donations"
    )

    # 🎯 destino flexible
    destination_type = models.CharField(
        max_length=20,
        choices=DestinationType.choices
    )

    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="donations"
    )

    status = models.CharField(
        max_length=20,
        choices=DonationStatus.choices,
        default=DonationStatus.PENDING
    )

    # 💰 si hay donación monetaria directa
    money_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation #{self.id} - {self.donor}"


class DonationItem(models.Model):

    class Condition(models.TextChoices):
        NEW = "new", "Nuevo"
        GOOD = "good", "Buen estado"
        USED = "used", "Usado"

    donation = models.ForeignKey(
        "Donation",
        on_delete=models.CASCADE,
        related_name="items"
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    quantity = models.PositiveIntegerField(default=1)

    condition = models.CharField(
        max_length=20,
        choices=Condition.choices,
        default=Condition.GOOD
    )

    estimated_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

class DonationTracking(models.Model):

    class EventType(models.TextChoices):
        CREATED = "created", "Creada"
        RECEIVED = "received", "Recibida"
        SORTED = "sorted", "Clasificada"
        DELIVERED = "delivered", "Entregada"

    donation = models.ForeignKey(
        Donation,
        on_delete=models.CASCADE,
        related_name="tracking"
    )

    event = models.CharField(max_length=20, choices=EventType.choices)

    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donation_id} - {self.event}"

class DonationImage(models.Model):
    donation = models.ForeignKey(
        "Donation",
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(upload_to="donations/images/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for Donation #{self.donation_id}"