# views.py
from rest_framework import viewsets
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from .utils import perform_semantic_search
from .models import SemanticImageSearch
from .serializers import SemanticImageSearchSerializer
from PIL import Image

class SearchViewSet(viewsets.ModelViewSet):
    queryset = SemanticImageSearch.objects.all()
    serializer_class = SemanticImageSearchSerializer

    def create(self, request, *args, **kwargs):
        try:
            query = request.data.get('query')
            image_files = request.FILES.getlist('images')

            # Create SemanticImageSearch instance
            semantic_search = SemanticImageSearch.objects.create(query=query)

            # Associate images with the SemanticImageSearch instance
            for image_file in image_files:
                image_instance = Image.objects.create(image=image_file)
                semantic_search.images.add(image_instance)

            # Perform semantic search logic and update the result field
            result = perform_semantic_search(query, image_files)
            semantic_search.result = result
            semantic_search.save()

            serializer = SemanticImageSearchSerializer(semantic_search)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)