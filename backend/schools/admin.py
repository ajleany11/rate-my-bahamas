from django.contrib import admin

from .models import College, School


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'college', 'slug')
    list_filter = ('college',)
    search_fields = ('name',)
