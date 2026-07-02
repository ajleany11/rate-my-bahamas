from django.db import migrations, models


def set_price_to_199(apps, schema_editor):
    Semester = apps.get_model('billing', 'Semester')
    Semester.objects.filter(price_cents=100).update(price_cents=199)


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0002_rename_stripe_payment_intent_id_payment_payoneer_short_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='semester',
            name='price_cents',
            field=models.PositiveIntegerField(default=199),
        ),
        migrations.RunPython(set_price_to_199, migrations.RunPython.noop),
    ]
