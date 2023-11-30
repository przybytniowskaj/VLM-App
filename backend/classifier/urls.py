from django.urls import path, include
from rest_framework import routers

from .views import ClassifierViewSet, SearchViewSet, UserCaptionChoicesViewSet, GetFlickrImagesView

router = routers.DefaultRouter()
router.register(r'semanticimagesearch', SearchViewSet)
router.register(r'classifier', ClassifierViewSet)
router.register(r'user-caption-choices', UserCaptionChoicesViewSet, basename='user-caption-choices')

urlpatterns = [
    path('get_flickr_images/', GetFlickrImagesView.as_view(), name='get_flickr_images'),
    path('', include(router.urls)),
]
