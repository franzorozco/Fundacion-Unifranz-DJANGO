from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model

# 🔹 ROLES (sin choices, flexible)
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# 🔹 USUARIO PERSONALIZADO
class User(AbstractUser):
    email = models.EmailField(unique=True)

    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)

    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)  # 👈 BIEN alineado

    is_verified = models.BooleanField(default=False)
    is_active_volunteer = models.BooleanField(default=True)
    bio = models.TextField(blank=True, null=True)

    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name='users')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


# 🔹 CATÁLOGO DE HABILIDADES
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# 🔹 PERFIL DEL VOLUNTARIO (IA READY)
class VolunteerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    experience_level = models.IntegerField(default=1)
    is_available = models.BooleanField(default=True)
    available_hours_per_week = models.IntegerField(default=0)

    ciudad = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)

    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)

    max_distance_km = models.FloatField(default=10)

    def clean(self):
        if not (1 <= self.experience_level <= 5):
            raise ValidationError("El nivel de experiencia debe estar entre 1 y 5")

    def __str__(self):
        return f"Perfil de {self.user.email}"


# 🔹 RELACIÓN USUARIO - HABILIDADES (CON PESO)
class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    level = models.IntegerField(default=50)  # 0 - 100
    years_experience = models.FloatField(default=0)
    is_certified = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'skill')
        indexes = [
            models.Index(fields=['skill']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.skill.name}"


# 🔹 DISPONIBILIDAD (TIPO HORARIO)
class Availability(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='availability')

    DAY_CHOICES = (
        ('mon', 'Lunes'),
        ('tue', 'Martes'),
        ('wed', 'Miércoles'),
        ('thu', 'Jueves'),
        ('fri', 'Viernes'),
        ('sat', 'Sábado'),
        ('sun', 'Domingo'),
    )

    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("La hora de inicio debe ser menor que la hora de fin")

    def __str__(self):
        return f"{self.user.email} - {self.day}"


# 🔹 SIGNAL PARA CREAR ROLES POR DEFECTO Y SUPERUSUARIO
@receiver(post_migrate)
def create_default_roles_and_superuser(sender, **kwargs):
    UserModel = get_user_model()
    # Roles por defecto
    default_roles = ["Admin", "Coordinador", "Voluntario", "Supervisor", "Invitado"]
    for role_name in default_roles:
        Role.objects.get_or_create(name=role_name)

    # Superusuario con rol Admin
    admin_role = Role.objects.get(name="Admin")
    admin_email = "admin@gmail.com"
    admin_username = "admin"
    admin_password = "123456"

    if not UserModel.objects.filter(email=admin_email).exists():
        UserModel.objects.create_superuser(
            username=admin_username,
            email=admin_email,
            password=admin_password,
            role=admin_role
        )
        print("Superusuario admin creado")