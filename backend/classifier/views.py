from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from PIL import Image as PILImage
from django.http import JsonResponse
import json, os
from django.conf import settings
from django.views import View
from pathlib import Path

from .serializers import ClassifierSerializer, SemanticImageSearchSerializer, UserCaptionChoicesSerializer
from .models import Classifier, SemanticImageSearch, UserCaptionChoices
from .utils import perform_semantic_search, device, model, preprocess

class ClassifierViewSet(viewsets.ModelViewSet):
  queryset = Classifier.objects.all().order_by('-date_uploaded')
  serializer_class = ClassifierSerializer

class SearchViewSet(viewsets.ModelViewSet):
    queryset = SemanticImageSearch.objects.all().order_by('-date_uploaded')
    serializer_class = SemanticImageSearchSerializer

    @action(detail=False, methods=['post'])
    def semantic_image_search(self, request):
      print("Received POST request for semantic_image_search")
      
      try:
        query = request.data.get('query')
        images = request.FILES.getlist('images')
        flickr_flag = request.data.get('flickr_flag')
        print(flickr_flag)
        if flickr_flag is not True:
            feature = request.data.get('image_features')
        result, features, result_full = perform_semantic_search(query, images, feature, flickr=flickr_flag)  

        features = [feature.tolist() for feature in features]
        semantic_search = SemanticImageSearch.objects.create(query=query, image_features=features, result=result, result_full=result_full)
        images_list = []
        for image_file in images:
            semantic_search.images.create(image=image_file)
            images_list.append(image_file)
        semantic_search.save()

        return Response({'message': 'Semantic search successful.'})
        
      except Exception as e:
        print(f"An error occurred: {str(e)}")
        return Response({'error': str(e)})
      
    @action(detail=False, methods=['get'])
    def get_semantic_image_search(self, request):
        try:
            latest_semantic_search = SemanticImageSearch.objects.latest('date_uploaded')
            serializer = SemanticImageSearchSerializer(latest_semantic_search)

            return JsonResponse(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def get_flickr_search(self, request):
      try:
          latest_semantic_search = SemanticImageSearch.objects.oldest('date_uploaded')
          serializer = SemanticImageSearchSerializer(latest_semantic_search)

          return JsonResponse(serializer.data)
      except Exception as e:
          return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserCaptionChoicesViewSet(viewsets.ModelViewSet):
    queryset = UserCaptionChoices.objects.all()
    serializer_class = UserCaptionChoicesSerializer

class GetFlickrImagesView(View):
    def get(self, request):
        flickr_folder = Path(settings.MEDIA_ROOT) / 'flickr'
        image_paths = [str(img.relative_to(settings.MEDIA_ROOT)) for img in flickr_folder.glob('*.jpg')]
        paths = [f'/media/{str(Path(path).as_posix())}' for path in image_paths]
        return JsonResponse(paths, safe=False)

    def get_flickr_images(self):
        flickr_images = []
        flickr_folder_path = os.path.join(settings.MEDIA_ROOT, 'flickr')

        if os.path.exists(flickr_folder_path):
            files = os.listdir(flickr_folder_path)
            flickr_images = [self.get_image_url(file) for file in files]

        return flickr_images

    def get_image_url(self, file_name):
        return os.path.join(settings.MEDIA_URL, 'flickr', file_name)