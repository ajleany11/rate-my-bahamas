from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from professors.models import Course
from professors.serializers import CourseSerializer

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


class OtherCoursesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        known_departments = set(School.objects.values_list('name', flat=True))
        courses = Course.objects.exclude(department__in=known_departments).order_by('code')
        return Response({
            'id': None,
            'name': 'Other Courses',
            'slug': 'other',
            'college': None,
            'courses': CourseSerializer(courses, many=True).data,
        })
