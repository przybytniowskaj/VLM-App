
import numpy as np
import tensorflow as tf
from django.db import models

from transformers import BlipProcessor, BlipForConditionalGeneration

import config.settings as settings
from PIL import Image
import PIL.Image
from .utils import perform_semantic_search
from rest_framework.response import Response
import ssl

processorBlip = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
modelBlip = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

class Classifier(models.Model):
  image = models.ImageField(upload_to='images')
  result = models.TextField(blank=True, null=True)
  date_uploaded = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return 'Image classfied at {}'.format(self.date_uploaded.strftime('%Y-%m-%d %H:%M'))

  def save(self, *args, **kwargs):
    try:
      ssl._create_default_https_context = ssl._create_unverified_context
      
      img = PIL.Image.open(self.image)
      inputs = processorBlip(img, return_tensors="pt")
      out = modelBlip.generate(**inputs, num_return_sequences=5,num_beams=5, do_sample=True)
 
      generated_text = [processorBlip.decode(output, skip_special_tokens=True) for output in out]
      self.result = generated_text

      print('Success')
    except Exception as e:
      print('Classification failed:', e)

    return super().save(*args, **kwargs)

class Image(models.Model):
    image = models.ImageField(upload_to='images')

    def __str__(self):
        return self.image.url

class SemanticImageSearch(models.Model):
    query = models.TextField()
    result = models.CharField(max_length=250, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    images = models.ManyToManyField(Image)
    image_features = models.JSONField(blank=True, null=True)

    def __str__(self):
      return 'Semantic search for "{}" - {}'.format(self.query, self.date_uploaded.strftime('%Y-%m-%d %H:%M'))
