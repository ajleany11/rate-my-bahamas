from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, VerificationCode


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('UB Verification', {'fields': ('ub_email', 'is_ub_student')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('UB Verification', {'fields': ('ub_email', 'is_ub_student')}),
    )
    list_display = ('username', 'email', 'ub_email', 'is_ub_student', 'is_staff', 'is_active')


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'purpose', 'code', 'created_at', 'expires_at', 'is_used')
    list_filter = ('purpose', 'is_used')
