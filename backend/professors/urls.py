from django.urls import path

from .views import CourseDetailView

urlpatterns = [
    path('<str:code>/', CourseDetailView.as_view(), name='course-detail'),
]
