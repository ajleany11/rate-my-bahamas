from django.urls import path

from .views import CourseDetailView, SimilarCoursesView

urlpatterns = [
    path('<str:code>/similar/', SimilarCoursesView.as_view(), name='course-similar'),
    path('<str:code>/', CourseDetailView.as_view(), name='course-detail'),
]
