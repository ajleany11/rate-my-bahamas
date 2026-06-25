from django.contrib import admin

from .models import Course, Professor, Review


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'slug')
    search_fields = ('name', 'department')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'department')
    search_fields = ('code', 'name')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'professor', 'course', 'rating', 'difficulty', 'created_at')
    list_filter = ('rating', 'difficulty')
