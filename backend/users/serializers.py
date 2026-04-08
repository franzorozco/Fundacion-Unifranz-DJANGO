from rest_framework import serializers
from .models import User, Role, Skill, UserSkill, VolunteerProfile


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        exclude = ["user"]  # 🔥 mejor que required=False


class VolunteerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):

    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        required=False,
        allow_null=True
    )

    role_detail = RoleSerializer(source='role', read_only=True)

    profile_image = serializers.ImageField(required=False)
    profile = VolunteerProfileSerializer(required=False)

    skills = UserSkillSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def validate_username(self, value):
        if " " in value:
            raise serializers.ValidationError("No se permiten espacios")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        role = validated_data.pop('role', None)
        profile_data = validated_data.pop('profile', None)
        skills_data = validated_data.pop('skills', [])

        if not role:
            role = Role.objects.filter(name="Voluntario").first()

        user = User(**validated_data)
        user.role = role

        if password:
            user.set_password(password)

        user.save()

        if profile_data:
            VolunteerProfile.objects.create(user=user, **profile_data)

        for skill_data in skills_data:
            UserSkill.objects.create(user=user, **skill_data)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        role = validated_data.pop('role', None)
        profile_data = validated_data.pop('profile', None)
        skills_data = validated_data.pop('skills', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if role is not None:
            instance.role = role

        if password:
            instance.set_password(password)

        instance.save()

        if profile_data:
            profile, created = VolunteerProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        if skills_data is not None:
            UserSkill.objects.filter(user=instance).delete()

            for skill_data in skills_data:
                UserSkill.objects.create(user=instance, **skill_data)

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['role'] = RoleSerializer(instance.role).data if instance.role else None

        profile = getattr(instance, 'profile', None)
        data['profile'] = (
            VolunteerProfileSerializer(profile).data if profile else None
        )

        skills = instance.skills.all()
        data['skills'] = UserSkillSerializer(skills, many=True).data

        return data