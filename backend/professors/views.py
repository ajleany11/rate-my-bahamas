from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from schools.models import School

from .models import Course, Professor, ProfessorCourse
from .serializers import (
    CourseDetailSerializer,
    CourseSerializer,
    ProfessorCourseCreateSerializer,
    ProfessorCourseDetailSerializer,
    ProfessorDetailSerializer,
    ProfessorSerializer,
    ReviewCreateSerializer,
    top_rated_professors,
)

TOP_RATED_PROFESSORS_LIMIT = 5

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


class ProfessorCourseCreateView(generics.CreateAPIView):
    serializer_class = ProfessorCourseCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProfessorListView(generics.ListAPIView):
    queryset = Professor.objects.all().order_by('name')
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.AllowAny]


class TopRatedProfessorsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        results = [
            {
                'id': professor.id,
                'name': professor.name,
                'department': professor.department,
                'slug': professor.slug,
                'photo_url': professor.photo_url,
                'overall_average_rating': overall['average_rating'],
                'overall_would_take_again_percent': overall['would_take_again_percent'],
                'overall_review_count': overall['review_count'],
            }
            for professor, overall in top_rated_professors(TOP_RATED_PROFESSORS_LIMIT)
        ]
        return Response(results)


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


class CourseAssignSchoolView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        school_slug = request.data.get('school_slug')
        if not school_slug:
            return Response({'error': 'school_slug is required.'}, status=status.HTTP_400_BAD_REQUEST)
        school = get_object_or_404(School, slug=school_slug)
        course.department = school.name
        course.department_confirmed = False
        course.save(update_fields=['department', 'department_confirmed'])
        return Response({'department': course.department, 'department_confirmed': False})
