from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('professors', '0008_alter_professor_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='department_confirmed',
            field=models.BooleanField(default=True),
        ),
    ]
