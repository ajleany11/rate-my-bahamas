from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ub_email = models.EmailField(unique=True)
    is_ub_student = models.BooleanField(default=False)


class VerificationCode(models.Model):
    SIGNUP = 'signup'
    PASSWORD_RESET = 'password_reset'
    PURPOSE_CHOICES = [
        (SIGNUP, 'Signup'),
        (PASSWORD_RESET, 'Password Reset'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f'{self.code} for {self.user} ({self.purpose})'
