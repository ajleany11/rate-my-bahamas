from django.urls import path

from .views import CourseAssignSchoolView, CourseDetailView, CourseListView, SimilarCoursesView

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/assign-school/', CourseAssignSchoolView.as_view(), name='course-assign-school'),
    path('<str:code>/similar/', SimilarCoursesView.as_view(), name='course-similar'),
    path('<str:code>/', CourseDetailView.as_view(), name='course-detail'),
]
