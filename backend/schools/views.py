from django.db.models import Count
from rest_framework import generics, permissions

from .models import College, School
from .serializers import (
    CollegeDetailSerializer,
    CollegeListSerializer,
    SchoolCoursesSerializer,
    SchoolSearchSerializer,
)


class CollegeListView(generics.ListAPIView):
    queryset = College.objects.annotate(school_count=Count('schools'))
    serializer_class = CollegeListSerializer
    permission_classes = [permissions.AllowAny]


class CollegeDetailView(generics.RetrieveAPIView):
    queryset = College.objects.prefetch_related('schools')
    serializer_class = CollegeDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class SchoolListView(generics.ListAPIView):
    queryset = School.objects.select_related('college').order_by('name')
    serializer_class = SchoolSearchSerializer
    permission_classes = [permissions.AllowAny]


class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.select_related('college')
    serializer_class = SchoolCoursesSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
