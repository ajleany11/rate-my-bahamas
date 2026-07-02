import math
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

TRIAL_DAYS = 3


class Semester(models.Model):
    name = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    price_cents = models.PositiveIntegerField(default=100)

    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return self.name

    @property
    def is_active(self):
        today = timezone.localdate()
        return self.start_date <= today <= self.end_date

    @classmethod
    def get_current(cls):
        """The semester currently being sold: the soonest one that hasn't ended yet.

        Deliberately not restricted to `start_date <= today` — students should be able
        to pay for an upcoming semester before it officially starts.
        """
        today = timezone.localdate()
        return cls.objects.filter(end_date__gte=today).order_by('end_date').first()


class Payment(models.Model):
    PENDING = 'pending'
    PAID = 'paid'
    FAILED = 'failed'
    STATUS_CHOICES = [(PENDING, 'Pending'), (PAID, 'Paid'), (FAILED, 'Failed')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='payments')
    # Our own ID, sent as `transactionId` on the LIST request — this is what ties the
    # later notification back to this row (Payoneer's own list/transaction IDs aren't
    # guaranteed available until the notification arrives).
    payoneer_transaction_id = models.CharField(max_length=255, unique=True)
    payoneer_short_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'semester')

    def __str__(self):
        return f'{self.user} - {self.semester} ({self.status})'


def user_trial_days_remaining(user):
    """Full days remaining in the free trial (ceiling). 0 if expired or not applicable."""
    if not user or not user.is_authenticated:
        return 0
    delta = user.date_joined + timedelta(days=TRIAL_DAYS) - timezone.now()
    return max(0, math.ceil(delta.total_seconds() / 86400))


def user_is_on_trial(user):
    """True if the user's free trial is still active."""
    return user_trial_days_remaining(user) > 0


def user_has_active_access(user):
    """True if `user` has a paid Payment for a current semester, or is within the free trial."""
    if not user or not user.is_authenticated:
        return False
    if user_is_on_trial(user):
        return True
    today = timezone.localdate()
    return Payment.objects.filter(
        user=user, status=Payment.PAID, semester__end_date__gte=today
    ).exists()
