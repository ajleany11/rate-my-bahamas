import re
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core import signing
from django.utils import timezone
from rest_framework import serializers

from .models import PendingSignup, VerificationCode
from .utils import CODE_LIFETIME_MINUTES, generate_code, issue_verification_code, send_code_email, send_verification_email

UB_EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@ub\.edu\.bs$')
RESET_TOKEN_SALT = 'accounts.password-reset'
RESET_TOKEN_MAX_AGE = 10 * 60  # seconds

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    ub_email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    def validate_ub_email(self, value):
        if User.objects.filter(ub_email__iexact=value, is_active=True).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match.'})
        return attrs

    def save(self):
        full_name = self.validated_data['full_name'].strip()
        first_name, _, last_name = full_name.partition(' ')
        ub_email = self.validated_data['ub_email']

        code = generate_code()
        pending = PendingSignup.objects.filter(ub_email__iexact=ub_email).first() or PendingSignup()
        pending.ub_email = ub_email
        pending.first_name = first_name
        pending.last_name = last_name
        pending.password_hash = make_password(self.validated_data['password'])
        pending.code = code
        pending.expires_at = timezone.now() + timedelta(minutes=CODE_LIFETIME_MINUTES)
        pending.save()

        send_code_email(ub_email, VerificationCode.SIGNUP, code)


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        pending = PendingSignup.objects.filter(ub_email__iexact=attrs['email']).first()
        if not pending:
            raise serializers.ValidationError('Invalid email or this account is already verified.')
        if pending.code != attrs['code'] or not pending.is_valid():
            raise serializers.ValidationError({'code': 'Invalid or expired code.'})

        attrs['pending'] = pending
        return attrs

    def save(self):
        pending = self.validated_data['pending']
        user = User(
            username=pending.ub_email,
            email=pending.ub_email,
            ub_email=pending.ub_email,
            first_name=pending.first_name,
            last_name=pending.last_name,
            is_ub_student=True,
            is_active=True,
            password=pending.password_hash,
        )
        user.save()
        pending.delete()
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
