from django.contrib import admin

from .models import Payment, Semester


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'price_cents')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'semester', 'status', 'created_at', 'paid_at')
    list_filter = ('status', 'semester')
    search_fields = ('user__username', 'user__ub_email')
