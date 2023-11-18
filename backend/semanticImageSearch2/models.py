from django.db import models
import ssl
import pandas as pd, numpy as np
import tensorflow as tf
from PIL import Image
import cv2
import requests
from transformers import CLIPProcessor, CLIPTextModel, CLIPModel, logging

class SemanticImageSearch(models.Model):
    query = models.TextField()
    result = models.CharField(max_length=250, blank=True, null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)

class Image(models.Model):
    image = models.ImageField(upload_to='images')
    semantic_searches = models.ManyToManyField(SemanticImageSearch)

    def __str__(self):
        return 'Image uploaded at {}'.format(self.date_uploaded.strftime('%Y-%m-%d %H:%M'))

    def compute_text_embeddings(list_of_strings, model, processor):
      inputs = processor(text=list_of_strings, return_tensors="pt", padding=True)
      return model.get_text_features(**inputs)
    
    def image_search(n_results=5):
      text_embeddings = self.compute_text_embeddings([query]).detach().numpy()
      results = np.argsort((embeddings[k]@text_embeddings.T)[:, 0])[-1:-n_results-1:-1]
      return [(df[k].iloc[i]['path'],
              df[k].iloc[i]['tooltip'] + source[k],
              df[k].iloc[i]['link']) for i in results]
    
    def save(self, *args, **kwargs):
        try:
            ssl._create_default_https_context = ssl._create_unverified_context
            model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


            # Process multiple images
            for image in self.images.all():
                img = Image.open(image.image)


                img_array = tf.keras.preprocessing.image.img_to_array(img)
                dimensions = (299, 299)

                resized_image = cv2.resize(img_array, dimensions, interpolation=cv2.INTER_AREA)
                ready_image = np.expand_dims(resized_image, axis=0)
                ready_image = tf.keras.applications.inception_resnet_v2.preprocess_input(ready_image)

                # Process textual input
                # Use CLIP model for classification
            processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")
            model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
            inputs = processor(self.phrase, return_tensors="pt", padding=True)

            # Get text features
            text_features = model(**inputs).last_hidden_state

                # Combine image and text features for sorting

            # Sort results based on confidence scores or relevance

            # Save the result or return it as needed

            print('Success')
        except Exception as e:
            print('Classification failed:', e)

        return super().save(*args, **kwargs)
