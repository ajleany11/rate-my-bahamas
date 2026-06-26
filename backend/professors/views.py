from rest_framework import generics, permissions

from .models import Course, ProfessorCourse
from .serializers import CourseDetailSerializer, ProfessorCourseDetailSerializer


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'code'


class ProfessorCourseDetailView(generics.RetrieveAPIView):
    queryset = ProfessorCourse.objects.select_related('professor', 'course')
    serializer_class = ProfessorCourseDetailSerializer
    permission_classes = [permissions.AllowAny]
