from django.db import models
from django.conf import settings
from users.models import Skill
User = settings.AUTH_USER_MODEL


# =========================
# CAMPAÑA PRINCIPAL
# =========================
class Campaign(models.Model):

    class CampaignStatus(models.TextChoices):
        DRAFT = "draft", "Borrador"
        ACTIVE = "active", "Activa"
        PAUSED = "paused", "Pausada"
        FINISHED = "finished", "Finalizada"

    title = models.CharField(max_length=255)
    description = models.TextField()

    image = models.ImageField(upload_to="campaigns/", null=True, blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="campaigns"
    )

    # 🧠 NUEVO → RESPONSABLE
    manager = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_campaigns"
    )

    status = models.CharField(
        max_length=20,
        choices=CampaignStatus.choices,
        default=CampaignStatus.DRAFT
    )

    # 📅 TIEMPO
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    # 🎯 OBJETIVOS
    goal_description = models.TextField(blank=True, null=True)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # 💰 SEGUIMIENTO REAL
    collected_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # 👥 MÉTRICAS
    total_volunteers = models.PositiveIntegerField(default=0)
    total_activities = models.PositiveIntegerField(default=0)

    # 📍 UBICACIÓN
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default="Bolivia")

    # 🏷️ CLASIFICACIÓN
    category = models.CharField(max_length=100, blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)

    # 🔒 CONTROL
    is_featured = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)

    # 📊 PRIORIDAD
    priority = models.IntegerField(default=1)  # 1 baja, 5 alta

    # 🧾 ADMIN
    notes_admin = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def progress_percentage(self):
        if self.goal_amount and self.goal_amount > 0:
            return (self.collected_amount / self.goal_amount) * 100
        return 0

    def __str__(self):
        return self.title

    class CampaignStatus(models.TextChoices):
        DRAFT = "draft", "Borrador"
        ACTIVE = "active", "Activa"
        PAUSED = "paused", "Pausada"
        FINISHED = "finished", "Finalizada"

    title = models.CharField(max_length=255)
    description = models.TextField()

    # 🖼️ NUEVO
    image = models.ImageField(upload_to="campaigns/", null=True, blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="campaigns"
    )

    status = models.CharField(
        max_length=20,
        choices=CampaignStatus.choices,
        default=CampaignStatus.DRAFT
    )

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    # 🎯 META MÁS REAL
    goal_description = models.TextField(blank=True, null=True)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # 📍 UBICACIÓN GENERAL
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default="Bolivia")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
        
# =========================
# ACTIVIDADES DE CAMPAÑA
# =========================
class CampaignActivity(models.Model):

    class ActivityStatus(models.TextChoices):
        PENDING = "pending", "Pendiente"
        IN_PROGRESS = "in_progress", "En progreso"
        DONE = "done", "Completada"
        CANCELLED = "cancelled", "Cancelada"

    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name="activities"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=ActivityStatus.choices,
        default=ActivityStatus.PENDING
    )

    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    required_volunteers = models.PositiveIntegerField(default=1)

    # 👥 CONTROL REAL
    assigned_volunteers = models.PositiveIntegerField(default=0)

    # 🧠 REQUISITOS
    min_age = models.PositiveIntegerField(null=True, blank=True)
    max_age = models.PositiveIntegerField(null=True, blank=True)

    # 🎁 RECOMPENSAS
    reward_points = models.PositiveIntegerField(default=0)

    # 🚨 PRIORIDAD
    priority = models.IntegerField(default=1)

    # 📊 ESTADO LOGÍSTICO
    is_urgent = models.BooleanField(default=False)
    requires_transport = models.BooleanField(default=False)

    # 🧾 ADMIN
    notes_admin = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.campaign.title}"





class ActivitySkillRequirement(models.Model):
    activity = models.ForeignKey(
        CampaignActivity,
        on_delete=models.CASCADE,
        related_name="skill_requirements"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="activity_requirements"
    )

    # 🔥 NIVEL REQUERIDO (0-100 o 1-5)
    required_level = models.PositiveIntegerField(default=50)

    is_mandatory = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.activity.title} - {self.skill.name}"

# =========================
# UBICACIONES DE ACTIVIDAD
# =========================
class ActivityLocation(models.Model):

    activity = models.OneToOneField(
        CampaignActivity,
        on_delete=models.CASCADE,
        related_name="location"
    )

    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="Bolivia")

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # 🧠 NUEVO
    reference = models.CharField(max_length=255, blank=True, null=True)

    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.address} - {self.city}"

# =========================
# VOLUNTARIOS EN ACTIVIDAD
# =========================

class ActivityVolunteer(models.Model):

    class Status(models.TextChoices):
        APPLIED = "applied", "Postulado"
        APPROVED = "approved", "Aprobado"
        REJECTED = "rejected", "Rechazado"
        COMPLETED = "completed", "Completado"

    activity = models.ForeignKey(
        CampaignActivity,
        on_delete=models.CASCADE,
        related_name="volunteers"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="activities"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED
    )

    # 🧠 TRACKING
    hours_contributed = models.FloatField(default=0)
    rating = models.IntegerField(null=True, blank=True)  # 1-5

    applied_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.activity}"


        