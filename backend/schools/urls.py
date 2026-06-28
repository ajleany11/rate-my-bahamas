from django.urls import path

from .views import CollegeDetailView, CollegeListView, SchoolDetailView, SchoolListView

urlpatterns = [
    path('', CollegeListView.as_view(), name='college-list'),
    path('schools/', SchoolListView.as_view(), name='school-list'),
    path('schools/<slug:slug>/', SchoolDetailView.as_view(), name='school-detail'),
    path('<slug:slug>/', CollegeDetailView.as_view(), name='college-detail'),
]
