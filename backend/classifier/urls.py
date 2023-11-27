from django.urls import path, include
from rest_framework import routers

from .views import ClassifierViewSet, SearchViewSet, UserCaptionChoicesViewSet

router = routers.DefaultRouter()
router.register(r'semanticimagesearch', SearchViewSet)
router.register(r'classifier', ClassifierViewSet)
router.register(r'user-caption-choices', UserCaptionChoicesViewSet, basename='user-caption-choices')


urlpatterns = router.urls
