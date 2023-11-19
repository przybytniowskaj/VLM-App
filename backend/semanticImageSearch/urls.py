from django.urls import path, include
from rest_framework import routers

from .views import SearchViewSet

router = routers.DefaultRouter()
router.register(r'semanticimagesearch', SearchViewSet, basename='semanticimagesearch')

urlpatterns = [
  path('', include(router.urls)),
]
