from django.urls import path

from .views import DepartmentDetailView, SchoolDetailView, SchoolListView

urlpatterns = [
    path('', SchoolListView.as_view(), name='school-list'),
    path('departments/<slug:slug>/', DepartmentDetailView.as_view(), name='department-detail'),
    path('<slug:slug>/', SchoolDetailView.as_view(), name='school-detail'),
]
