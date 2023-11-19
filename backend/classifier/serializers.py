from rest_framework import serializers
from .models import Classifier, SemanticImageSearch


class ClassifierSerializer(serializers.ModelSerializer):
  class Meta:
    model = Classifier
    fields = '__all__'


class SemanticImageSearchSerializer(serializers.ModelSerializer):
  class Meta:
    model = SemanticImageSearch
    fields = '__all__'

