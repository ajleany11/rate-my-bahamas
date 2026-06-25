from rest_framework import serializers

from .models import Department, School


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'slug')


class SchoolListSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'slug')


class SchoolDetailSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = School
        fields = ('id', 'name', 'slug', 'departments')
