from django.db.models import Count
from rest_framework import generics, permissions

from .models import Department, School
from .serializers import DepartmentCoursesSerializer, SchoolDetailSerializer, SchoolListSerializer


class SchoolListView(generics.ListAPIView):
    queryset = School.objects.annotate(department_count=Count('departments'))
    serializer_class = SchoolListSerializer
    permission_classes = [permissions.AllowAny]


class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.prefetch_related('departments')
    serializer_class = SchoolDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class DepartmentDetailView(generics.RetrieveAPIView):
    queryset = Department.objects.select_related('school')
    serializer_class = DepartmentCoursesSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
