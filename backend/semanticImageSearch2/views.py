from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import SemanticImageSearchSerializer
from .models import SemanticImageSearch
from django.http import JsonResponse
from .utils import perform_semantic_search

class SearchViewSet(viewsets.ModelViewSet):
  queryset = SemanticImageSearch.objects.all().order_by('-date_uploaded')
  serializer_class = SemanticImageSearchSerializer

  @action(detail=False, methods=['post'])
  def semantic_image_search(self, request):
      query = request.data.get('query')
      images = request.FILES.getlist('images')

      # Create SemanticImageSearch instance
      semantic_search = SemanticImageSearch.objects.create(query=query)

      # Associate images with the SemanticImageSearch instance
      for image_file in images:
          semantic_search.images.create(image=image_file)

      # Perform your semantic search logic and update the result field if needed


      return Response({'message': 'Semantic search successful.'})