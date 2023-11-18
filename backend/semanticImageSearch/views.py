# views.py
from rest_framework import viewsets
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from .utils import perform_semantic_search
from .models import SemanticImageSearch
from .serializers import SemanticImageSearchSerializer

class SearchViewSet(viewsets.ModelViewSet):
    queryset = SemanticImageSearch.objects.all().order_by('-date_uploaded')
    serializer_class = SemanticImageSearchSerializer

    @action(detail=False, methods=['post'])
    def semantic_image_search(self, request):
      try:
        query = request.data.get('query')
        images = request.FILES.getlist('images')
        # Create SemanticImageSearch instance
        semantic_search = SemanticImageSearch.objects.create(query=query)

        # Associate images with the SemanticImageSearch instance
        for image_file in images:
            semantic_search.images.create(image=image_file)
        
        # Perform semantic search logic and update the result field
        result = perform_semantic_search(query, images)
        semantic_search.result = result
        semantic_search.save()

        return Response({'message': 'Semantic search successful.'})
      except Exception as e:
            return Response({'error': str(e)})
