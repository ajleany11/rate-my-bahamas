from django.contrib import admin

from .models import Course, Professor, ProfessorCourse, Review


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'slug')
    search_fields = ('name', 'department')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'department')
    search_fields = ('code', 'name')


@admin.register(ProfessorCourse)
class ProfessorCourseAdmin(admin.ModelAdmin):
    list_display = ('professor', 'course')
    search_fields = ('professor__name', 'course__code', 'course__name')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'professor', 'course', 'rating', 'difficulty', 'would_take_again', 'uses_textbook', 'created_at')
    list_filter = ('rating', 'difficulty', 'would_take_again', 'uses_textbook')
