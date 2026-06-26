from rest_framework import serializers

from .models import Department, School


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'slug')


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
