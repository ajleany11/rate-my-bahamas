from django.db.models import Count, Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from professors.models import Course, Professor
from professors.serializers import CourseSerializer, ProfessorSerializer
from schools.models import College, School
from schools.serializers import CollegeListSerializer, SchoolSearchSerializer

AUTOCOMPLETE_LIMIT = 5


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

        return Response({'suggestions': suggestions})
