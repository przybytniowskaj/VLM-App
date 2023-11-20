
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

class Classifier(models.Model):
  image = models.ImageField(upload_to='images')
  result = models.CharField(max_length=250, blank=True)
  date_uploaded = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return 'Image classfied at {}'.format(self.date_uploaded.strftime('%Y-%m-%d %H:%M'))

  def save(self, *args, **kwargs):
    try:
      ssl._create_default_https_context = ssl._create_unverified_context
      processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
      model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")  
      img = PIL.Image.open(self.image)
      inputs = processor(img, return_tensors="pt")
      out = model.generate(**inputs)
      generated_text = processor.decode(out[0], skip_special_tokens=True)
      self.result = generated_text
      print(generated_text)

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

    def __str__(self):
      return 'Semantic search for "{}" uploaded at {}'.format(self.query, self.date_uploaded.strftime('%Y-%m-%d %H:%M'))
