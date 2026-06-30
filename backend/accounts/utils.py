import random
from datetime import timedelta

from django.core.mail import send_mail
from django.utils import timezone

from .models import VerificationCode

CODE_LIFETIME_MINUTES = 15

PURPOSE_SUBJECTS = {
    VerificationCode.SIGNUP: 'Verify your KnowBeforeYouGo account',
    VerificationCode.PASSWORD_RESET: 'Reset your KnowBeforeYouGo password',
}

PURPOSE_MESSAGES = {
    VerificationCode.SIGNUP: (
        'Welcome to KnowBeforeYouGo!\n\n'
        'Your verification code is: {code}\n\n'
        'Enter this code to finish creating your account. '
        'It expires in {minutes} minutes.'
    ),
    VerificationCode.PASSWORD_RESET: (
        'We received a request to reset your KnowBeforeYouGo password.\n\n'
        'Your verification code is: {code}\n\n'
        'Enter this code to continue resetting your password. '
        'It expires in {minutes} minutes. '
        'If you did not request this, you can ignore this email.'
    ),
}


def generate_code():
    return f'{random.randint(0, 999999):06d}'


def send_code_email(email, purpose, code):
    subject = PURPOSE_SUBJECTS[purpose]
    message = PURPOSE_MESSAGES[purpose].format(code=code, minutes=CODE_LIFETIME_MINUTES)
    send_mail(subject, message, None, [email])


def issue_verification_code(user, purpose):
    VerificationCode.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
    code = generate_code()
    return VerificationCode.objects.create(
        user=user,
        code=code,
        purpose=purpose,
        expires_at=timezone.now() + timedelta(minutes=CODE_LIFETIME_MINUTES),
    )


def send_verification_email(user, code_obj):
    send_code_email(user.ub_email, code_obj.purpose, code_obj.code)
