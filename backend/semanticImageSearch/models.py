# models.py

from django.db import models

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
        return 'Semantic search for "{}" uploaded at {}'.format(self.query, self.date_uploaded.strftime('%Y-%m-%d %H:%M'))
