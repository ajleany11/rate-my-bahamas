from django.urls import path

from .views import SchoolDetailView, SchoolListView

urlpatterns = [
    path('', SchoolListView.as_view(), name='school-list'),
    path('<slug:slug>/', SchoolDetailView.as_view(), name='school-detail'),
]
