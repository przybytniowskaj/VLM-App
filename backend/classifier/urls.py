from django.urls import path, include
from rest_framework import routers

from .views import ClassifierViewSet, SearchViewSet

router = routers.DefaultRouter()
router.register(r'semanticimagesearch', SearchViewSet)
router.register(r'classifier', ClassifierViewSet)

urlpatterns = router.urls
