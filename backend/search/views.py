from django.db.models import Count, Q
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from professors.models import Course, Professor
from professors.serializers import CourseSerializer, ProfessorSerializer
from schools.models import College, School
from schools.serializers import CollegeListSerializer, SchoolSearchSerializer

from config.settings import CACHE_TTL_SHORT, CACHE_TTL_MEDIUM

AUTOCOMPLETE_LIMIT = 5


@method_decorator(cache_page(CACHE_TTL_SHORT), name='dispatch')
class SearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query:
            courses = Course.objects.none()
            schools = School.objects.none()
            professors = Professor.objects.none()
            colleges = College.objects.none()
        else:
            courses = Course.objects.filter(Q(code__icontains=query) | Q(name__icontains=query))
            schools = School.objects.select_related('college').filter(name__icontains=query)
            professors = Professor.objects.filter(
                Q(name__icontains=query) | Q(department__icontains=query)
            )
            colleges = College.objects.annotate(school_count=Count('schools')).filter(
                name__icontains=query
            )

        # Courses are listed first in the response to prioritize them in the UI.
        return Response({
            'courses': CourseSerializer(courses, many=True).data,
            'schools': SchoolSearchSerializer(schools, many=True).data,
            'professors': ProfessorSerializer(professors, many=True).data,
            'colleges': CollegeListSerializer(colleges, many=True).data,
        })


class SearchAutocompleteView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query:
            return Response({'suggestions': []})

        # Cache per-query autocomplete responses for a short time
        cache_key = f"autocomplete:{query.lower()}"
        cached = cache.get(cache_key)
        if cached is not None:
            return Response({'suggestions': cached})

        suggestions = []

        for course in Course.objects.filter(
            Q(code__icontains=query) | Q(name__icontains=query)
        )[:AUTOCOMPLETE_LIMIT]:
            suggestions.append({
                'type': 'course',
                'label': f'{course.code} - {course.name}',
                'query': course.code,
            })

        for professor in Professor.objects.filter(name__icontains=query)[:AUTOCOMPLETE_LIMIT]:
            suggestions.append({
                'type': 'professor',
                'label': professor.name,
                'query': professor.name,
                'slug': professor.slug,
            })

        for school in School.objects.filter(name__icontains=query)[:AUTOCOMPLETE_LIMIT]:
            suggestions.append({
                'type': 'school',
                'label': school.name,
                'query': school.name,
            })

        for college in College.objects.filter(name__icontains=query)[:AUTOCOMPLETE_LIMIT]:
            suggestions.append({
                'type': 'college',
                'label': college.name,
                'query': college.name,
            })

        cache.set(cache_key, suggestions, timeout=CACHE_TTL_SHORT)
        return Response({'suggestions': suggestions})
