from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from PIL import Image as PILImage
from django.http import JsonResponse
import json

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
        feature = request.data.get('image_features');
        result, features = perform_semantic_search(query, images, feature)  
        features = [feature.tolist() for feature in features]
        semantic_search = SemanticImageSearch.objects.create(query=query, image_features=features, result=result)
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

class UserCaptionChoicesViewSet(viewsets.ModelViewSet):
    queryset = UserCaptionChoices.objects.all()
    serializer_class = UserCaptionChoicesSerializer
