from django.db import models


class College(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class School(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='schools')
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return f'{self.name} ({self.college})'
