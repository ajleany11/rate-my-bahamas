from rest_framework import serializers

from .models import Course, Professor


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'name', 'department')


class CourseDetailSerializer(serializers.ModelSerializer):
    professors = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'code', 'name', 'department', 'description', 'professors')

    def get_professors(self, obj):
        professors = Professor.objects.filter(reviews__course=obj).distinct().order_by('name')
        return ProfessorSerializer(professors, many=True).data


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ('id', 'name', 'department', 'slug', 'photo_url')
