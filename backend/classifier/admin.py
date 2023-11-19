from django.contrib import admin
from .models import Classifier, SemanticImageSearch

admin.site.register(SemanticImageSearch)
admin.site.register(Classifier)
