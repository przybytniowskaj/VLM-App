from rest_framework import serializers
from .models import Classifier, SemanticImageSearch, Image, UserCaptionChoices, UserSearchChoices

class UserCaptionChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCaptionChoices
        fields = ['image_path', 'caption']

class UserSearchChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSearchChoices
        fields = ['image_path', 'phrase']

class ClassifierSerializer(serializers.ModelSerializer):
  class Meta:
    model = Classifier
    fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image']

class SemanticImageSearchSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = SemanticImageSearch
        fields = ['query', 'result', 'result_full', 'date_uploaded', 'images', 'image_features']

