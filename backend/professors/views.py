from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from schools.models import School

from .models import Course, Professor, ProfessorCourse, Review
from .serializers import (
    CourseDetailSerializer,
    CourseSerializer,
    MyReviewSerializer,
    ProfessorCourseCreateSerializer,
    ProfessorCourseDetailSerializer,
    ProfessorDetailSerializer,
    ProfessorSerializer,
    ReviewCreateSerializer,
    ReviewUpdateSerializer,
    top_rated_professors,
)
from config.settings import CACHE_TTL_MEDIUM, CACHE_TTL_LONG, CACHE_TTL_SHORT

TOP_RATED_PROFESSORS_LIMIT = 5

SIMILAR_COURSES_LIMIT = 6


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'code'


@method_decorator(cache_page(CACHE_TTL_MEDIUM), name='dispatch')
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


@method_decorator(cache_page(CACHE_TTL_MEDIUM), name='dispatch')
class ProfessorListView(generics.ListAPIView):
    queryset = Professor.objects.all().order_by('name')
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.AllowAny]


class TopRatedProfessorsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Use low-level cache to avoid recomputing the expensive aggregation used by top_rated_professors
        cache_key = f"top_rated_professors:{TOP_RATED_PROFESSORS_LIMIT}"
        results = cache.get(cache_key)
        if results is None:
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
            cache.set(cache_key, results, timeout=CACHE_TTL_LONG)
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


class MyReviewsListView(generics.ListAPIView):
    """All reviews written by the current user, most recent first."""

    serializer_class = MyReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).select_related('professor', 'course').order_by('-created_at')


class ReviewUpdateView(generics.RetrieveUpdateAPIView):
    """Lets a user view/edit one of their own reviews. Scoping the queryset to the
    requesting user (rather than checking ownership after lookup) means someone else's
    review ID 404s instead of 403ing, so it doesn't even confirm the review exists.
    """

    serializer_class = ReviewUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


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
