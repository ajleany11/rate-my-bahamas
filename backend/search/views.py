from django.db.models import Count, Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from professors.models import Course, Professor
from professors.serializers import CourseSerializer, ProfessorSerializer
from schools.models import School
from schools.serializers import SchoolListSerializer


class SearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query:
            courses = Course.objects.none()
            professors = Professor.objects.none()
            schools = School.objects.none()
        else:
            courses = Course.objects.filter(Q(code__icontains=query) | Q(name__icontains=query))
            professors = Professor.objects.filter(
                Q(name__icontains=query) | Q(department__icontains=query)
            )
            schools = School.objects.annotate(department_count=Count('departments')).filter(
                name__icontains=query
            )

        # Courses are listed first in the response to prioritize them in the UI.
        return Response({
            'courses': CourseSerializer(courses, many=True).data,
            'professors': ProfessorSerializer(professors, many=True).data,
            'schools': SchoolListSerializer(schools, many=True).data,
        })
