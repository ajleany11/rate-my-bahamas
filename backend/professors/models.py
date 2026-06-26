from django.conf import settings
from django.db import models


class Professor(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    department = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)
    photo_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255, db_index=True)
    department = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f'{self.code} - {self.name}'


class ProfessorCourse(models.Model):
    """A professor-course pairing: this professor has reviews for this course."""

    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='professor_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='professor_courses')

    class Meta:
        unique_together = ('professor', 'course')

    def __str__(self):
        return f'{self.professor} - {self.course}'


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='reviews')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    difficulty = models.PositiveSmallIntegerField()
    would_take_again = models.BooleanField(default=True)
    uses_textbook = models.BooleanField(default=False)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} on {self.professor} ({self.rating}/5)'

    def save(self, *args, **kwargs):
        ProfessorCourse.objects.get_or_create(professor=self.professor, course=self.course)
        super().save(*args, **kwargs)
