from django.contrib import admin

from .models import Department, School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'slug')
    list_filter = ('school',)
    search_fields = ('name',)
