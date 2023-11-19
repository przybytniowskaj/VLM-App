import cv2
import ssl
import numpy as np
import tensorflow as tf
from django.db import models

from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
import os
import config.settings as settings
from PIL import Image
import PIL.Image

class Classifier(models.Model):
  image = models.ImageField(upload_to='images')
  result = models.CharField(max_length=250, blank=True)
  date_uploaded = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return 'Image classfied at {}'.format(self.date_uploaded.strftime('%Y-%m-%d %H:%M'))

  def save(self, *args, **kwargs):
    try:
      # SSL certificate necessary so we can download weights of the InceptionResNetV2 model
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
        return 'Image uploaded at {}'.format(self.date_uploaded.strftime('%Y-%m-%d %H:%M'))

class SemanticImageSearch(models.Model):
    query = models.TextField()
    result = models.CharField(max_length=250, blank=True, null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    images = models.ManyToManyField(Image)

    def __str__(self):
        result_str = f'Result: {self.result}' if getattr(self, 'result', None) else 'No result yet'
        return f'Image classified at {self.date_uploaded.strftime("%Y-%m-%d %H:%M")}. {result_str}'

    def save(self, *args, **kwargs):

      return 
