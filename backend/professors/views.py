from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from .models import Course, Professor, ProfessorCourse
from .serializers import (
    CourseDetailSerializer,
    CourseSerializer,
    ProfessorCourseDetailSerializer,
    ProfessorDetailSerializer,
    ReviewCreateSerializer,
)

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
    queryset = Professor.objects.prefetch_related(
        Prefetch('professor_courses', queryset=ProfessorCourse.objects.select_related('course').order_by('course__code')),
        'reviews',
    )
    serializer_class = ProfessorDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
