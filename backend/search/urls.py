from django.urls import path

from .views import SearchAutocompleteView, SearchView

urlpatterns = [
    path('', SearchView.as_view(), name='search'),
    path('autocomplete/', SearchAutocompleteView.as_view(), name='search-autocomplete'),
]
