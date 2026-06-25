import re

from django.contrib.auth import get_user_model
from django.core import signing
from rest_framework import serializers

from .models import VerificationCode
from .utils import issue_verification_code, send_verification_email

UB_EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@ub\.edu\.bs$')
RESET_TOKEN_SALT = 'accounts.password-reset'
RESET_TOKEN_MAX_AGE = 10 * 60  # seconds

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('full_name', 'ub_email', 'password', 'password2')

    def validate_ub_email(self, value):
        if not UB_EMAIL_REGEX.match(value):
            raise serializers.ValidationError(
                'Please use your UB email address (must end in @ub.edu.bs).'
            )
        if User.objects.filter(ub_email__iexact=value, is_active=True).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        full_name = validated_data['full_name'].strip()
        first_name, _, last_name = full_name.partition(' ')
        ub_email = validated_data['ub_email']

        # An inactive user from an abandoned/expired signup attempt is reused
        # rather than rejected, so a never-verified email doesn't get stuck.
        user = User.objects.filter(ub_email__iexact=ub_email, is_active=False).first() or User()
        user.username = ub_email
        user.email = ub_email
        user.ub_email = ub_email
        user.first_name = first_name
        user.last_name = last_name
        user.is_ub_student = True
        user.is_active = False
        user.set_password(validated_data['password'])
        user.save()

        code_obj = issue_verification_code(user, VerificationCode.SIGNUP)
        send_verification_email(user, code_obj)
        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        try:
            user = User.objects.get(ub_email__iexact=attrs['email'], is_active=False)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or this account is already verified.')

        code_obj = VerificationCode.objects.filter(
            user=user, purpose=VerificationCode.SIGNUP, code=attrs['code'], is_used=False,
        ).order_by('-created_at').first()
        if not code_obj or not code_obj.is_valid():
            raise serializers.ValidationError({'code': 'Invalid or expired code.'})

        attrs['user'] = user
        attrs['code_obj'] = code_obj
        return attrs

    def save(self):
        user = self.validated_data['user']
        code_obj = self.validated_data['code_obj']
        user.is_active = True
        user.save(update_fields=['is_active'])
        code_obj.is_used = True
        code_obj.save(update_fields=['is_used'])
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(ub_email__iexact=value, is_active=True).exists():
            raise serializers.ValidationError('No account found with that email.')
        return value

    def save(self):
        user = User.objects.get(ub_email__iexact=self.validated_data['email'], is_active=True)
        code_obj = issue_verification_code(user, VerificationCode.PASSWORD_RESET)
        send_verification_email(user, code_obj)


class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        try:
            user = User.objects.get(ub_email__iexact=attrs['email'], is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or code.')

        code_obj = VerificationCode.objects.filter(
            user=user, purpose=VerificationCode.PASSWORD_RESET, code=attrs['code'], is_used=False,
        ).order_by('-created_at').first()
        if not code_obj or not code_obj.is_valid():
            raise serializers.ValidationError({'code': 'Invalid or expired code.'})

        attrs['user'] = user
        attrs['code_obj'] = code_obj
        return attrs

    def save(self):
        user = self.validated_data['user']
        code_obj = self.validated_data['code_obj']
        code_obj.is_used = True
        code_obj.save(update_fields=['is_used'])
        return signing.dumps(user.pk, salt=RESET_TOKEN_SALT)


class PasswordResetConfirmSerializer(serializers.Serializer):
    reset_token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({'new_password2': 'Passwords do not match.'})

        try:
            user_id = signing.loads(attrs['reset_token'], salt=RESET_TOKEN_SALT, max_age=RESET_TOKEN_MAX_AGE)
            user = User.objects.get(pk=user_id, is_active=True)
        except (signing.BadSignature, User.DoesNotExist):
            raise serializers.ValidationError('This reset link has expired. Please request a new code.')

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user
