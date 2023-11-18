from rest_framework import serializers
from .models import  SemanticImageSearch


class SemanticImageSearchSerializer(serializers.ModelSerializer):
  class Meta:
    model = SemanticImageSearch
    fields = '__all__'

