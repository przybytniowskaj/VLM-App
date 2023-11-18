from django.urls import path, include
from rest_framework import routers

from .views import SearchViewSet

router = routers.DefaultRouter()
router.register(r'semanticImageSearch', SearchViewSet)

urlpatterns = [
  path('', include(router.urls)),
]
