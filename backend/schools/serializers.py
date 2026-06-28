from rest_framework import serializers

from professors.models import Course
from professors.serializers import CourseSerializer

from .models import College, School


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'slug')


class SchoolCoursesSerializer(serializers.ModelSerializer):
    college = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ('id', 'name', 'slug', 'college', 'courses')

    def get_college(self, obj):
        return {'id': obj.college.id, 'name': obj.college.name, 'slug': obj.college.slug}

    def get_courses(self, obj):
        courses = Course.objects.filter(department=obj.name).order_by('code')
        return CourseSerializer(courses, many=True).data


class CollegeListSerializer(serializers.ModelSerializer):
    school_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = College
        fields = ('id', 'name', 'slug', 'school_count')


class CollegeDetailSerializer(serializers.ModelSerializer):
    schools = SchoolSerializer(many=True, read_only=True)

    class Meta:
        model = College
        fields = ('id', 'name', 'slug', 'schools')


class SchoolSearchSerializer(serializers.ModelSerializer):
    college = CollegeListSerializer(read_only=True)

    class Meta:
        model = School
        fields = ('id', 'name', 'slug', 'college')
