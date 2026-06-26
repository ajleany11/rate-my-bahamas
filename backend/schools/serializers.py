from rest_framework import serializers

from professors.models import Course
from professors.serializers import CourseSerializer

from .models import Department, School


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'slug')


class DepartmentCoursesSerializer(serializers.ModelSerializer):
    school = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ('id', 'name', 'slug', 'school', 'courses')

    def get_school(self, obj):
        return {'id': obj.school.id, 'name': obj.school.name, 'slug': obj.school.slug}

    def get_courses(self, obj):
        courses = Course.objects.filter(department=obj.name).order_by('code')
        return CourseSerializer(courses, many=True).data


class SchoolListSerializer(serializers.ModelSerializer):
    department_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = School
        fields = ('id', 'name', 'slug', 'department_count')


class SchoolDetailSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = School
        fields = ('id', 'name', 'slug', 'departments')


class DepartmentSearchSerializer(serializers.ModelSerializer):
    school = SchoolListSerializer(read_only=True)

    class Meta:
        model = Department
        fields = ('id', 'name', 'slug', 'school')
