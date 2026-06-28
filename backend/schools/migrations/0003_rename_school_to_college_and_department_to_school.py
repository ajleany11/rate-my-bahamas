import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    """Renames School->College and Department->School.

    Done via raw SQL (paired with state_operations) rather than plain RenameModel/RenameField,
    because SQLite's table-remake for the FK column rename regenerates an auto-named index whose
    deterministic name collides with a stale index left behind on the School->College table.
    Raw ALTER TABLE/RENAME COLUMN avoids the remake entirely; state_operations keeps Django's
    migration state in sync as if the declarative operations had run.
    """

    dependencies = [
        ('schools', '0002_alter_department_name_alter_school_name'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=[
                        'ALTER TABLE schools_school RENAME TO schools_college;',
                        'ALTER TABLE schools_department RENAME TO schools_school;',
                        'ALTER TABLE schools_school RENAME COLUMN school_id TO college_id;',
                    ],
                    reverse_sql=[
                        'ALTER TABLE schools_school RENAME COLUMN college_id TO school_id;',
                        'ALTER TABLE schools_school RENAME TO schools_department;',
                        'ALTER TABLE schools_college RENAME TO schools_school;',
                    ],
                ),
            ],
            state_operations=[
                migrations.RenameModel(old_name='School', new_name='College'),
                migrations.RenameModel(old_name='Department', new_name='School'),
                migrations.RenameField(model_name='school', old_name='school', new_name='college'),
                migrations.AlterField(
                    model_name='school',
                    name='college',
                    field=models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name='schools', to='schools.college'
                    ),
                ),
            ],
        ),
    ]
