"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from professors.views import (
    ProfessorCourseCreateView,
    ProfessorCourseDetailView,
    ProfessorDetailView,
    ProfessorListView,
    ReviewCreateView,
    TopRatedProfessorsView,
)
from .views import serve_frontend

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/courses/', include('professors.urls')),
    path('api/colleges/', include('schools.urls')),
    path('api/search/', include('search.urls')),
    path('api/professor-course/', ProfessorCourseCreateView.as_view(), name='professor-course-create'),
    path('api/professor-course/<int:pk>/', ProfessorCourseDetailView.as_view(), name='professor-course-detail'),
    path('api/professors/top-rated/', TopRatedProfessorsView.as_view(), name='professors-top-rated'),
    path('api/professors/', ProfessorListView.as_view(), name='professor-list'),
    path('api/professors/<slug:slug>/', ProfessorDetailView.as_view(), name='professor-detail'),
    path('api/reviews/', ReviewCreateView.as_view(), name='review-create'),
    # Catch-all, must stay last: hands any non-API/non-admin path to the React app
    # so client-side routing (React Router) can take over.
    re_path(r'^.*$', serve_frontend, name='frontend'),
]
