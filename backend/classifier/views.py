from rest_framework import viewsets

from .serializers import ClassifierSerializer, SemanticImageSearchSerializer
from .models import Classifier, SemanticImageSearch


class ClassifierViewSet(viewsets.ModelViewSet):
  queryset = Classifier.objects.all().order_by('-date_uploaded')
  serializer_class = ClassifierSerializer

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .utils import perform_semantic_search
from .models import SemanticImageSearch, Image
from .serializers import SemanticImageSearchSerializer, ImageSerializer
from PIL import Image as PILImage
from django.http import JsonResponse

class SearchViewSet(viewsets.ModelViewSet):
    queryset = SemanticImageSearch.objects.all().order_by('-date_uploaded')
    serializer_class = SemanticImageSearchSerializer

    @action(detail=False, methods=['post'])
    def semantic_image_search(self, request):
      print("Received POST request for semantic_image_search")
      try:
        query = request.data.get('query')
        images = request.FILES.getlist('images')
        semantic_search = SemanticImageSearch.objects.create(query=query)

        images_list = []
        for image_file in images:
            semantic_search.images.create(image=image_file)
            images_list.append(image_file)
            
        result = perform_semantic_search(query, images)  
        semantic_search.result = result
        semantic_search.save()

        return Response({'message': 'Semantic search successful.'})
      except Exception as e:
            return Response({'error': str(e)})

    @action(detail=False, methods=['get'])
    def get_semantic_image_search(self, request):
        try:
            latest_semantic_search = SemanticImageSearch.objects.latest('date_uploaded')
            serializer = SemanticImageSearchSerializer(latest_semantic_search)

            return JsonResponse(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
