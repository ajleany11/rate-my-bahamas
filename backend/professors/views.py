from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from .models import Course, Professor, ProfessorCourse
from .serializers import CourseDetailSerializer, CourseSerializer, ProfessorCourseDetailSerializer, ProfessorDetailSerializer

SIMILAR_COURSES_LIMIT = 6


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'code'


class SimilarCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        course = get_object_or_404(Course, code=self.kwargs['code'])
        return Course.objects.filter(department=course.department).exclude(pk=course.pk).order_by('code')[
            :SIMILAR_COURSES_LIMIT
        ]


class ProfessorCourseDetailView(generics.RetrieveAPIView):
    queryset = ProfessorCourse.objects.select_related('professor', 'course')
    serializer_class = ProfessorCourseDetailSerializer
    permission_classes = [permissions.AllowAny]


class ProfessorDetailView(generics.RetrieveAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
