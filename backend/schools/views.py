from django.db.models import Count
from rest_framework import generics, permissions

from .models import School
from .serializers import SchoolDetailSerializer, SchoolListSerializer


class SchoolListView(generics.ListAPIView):
    queryset = School.objects.annotate(department_count=Count('departments'))
    serializer_class = SchoolListSerializer
    permission_classes = [permissions.AllowAny]


class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.prefetch_related('departments')
    serializer_class = SchoolDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
