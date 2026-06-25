from rest_framework import serializers

from .models import Course, Professor


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'name', 'department')


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ('id', 'name', 'department', 'slug', 'photo_url')
