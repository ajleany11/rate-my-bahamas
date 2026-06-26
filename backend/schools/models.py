from django.db import models


class School(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Department(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return f'{self.name} ({self.school})'
