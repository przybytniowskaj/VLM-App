from transformers import CLIPProcessor, CLIPModel
import torch
import clip
from PIL import Image
import json
import csv
import numpy as np
from pathlib import Path
import ast
import pandas as pd
from django.conf import settings
import os

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-L/14", device=device)

def perform_semantic_search(query, images, features, flickr):

    image_features = json.loads(features) if (features is not None and flickr is None ) else [] # 

    if flickr: 
        image_features = read_csv_into_list(os.path.join(settings.MEDIA_ROOT, 'flickr_image_features.csv'), images)
        image_features = [torch.tensor(feature) for feature in image_features]
    if not image_features:
        for image in images:
            image = image.temporary_file_path()
            image_preprocessed = preprocess(Image.open(image)).unsqueeze(0).to(device)
            image_features.append(model.encode_image(image_preprocessed))
    else:   
        image_features = [torch.tensor(feature) for feature in image_features]

    text_preprocessed = clip.tokenize([query]).to(device)
    text_features = model.encode_text(text_preprocessed)

    similarities = []
    for image_feature in image_features:
        similarity = torch.nn.functional.cosine_similarity(text_features, image_feature, dim=1)
        similarities.append(similarity.item())
  

    threshold = 0.15
    filtered_similarities = [index for index, sim in enumerate(similarities) if sim > threshold]
    ranked_images = sorted(filtered_similarities, key=lambda x: similarities[x], reverse=True)
    ranked_images_full = [index for index, _ in sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)]

    result = ', '.join([f"{index}" for index in ranked_images])
    result_full = ', '.join([f"{index}" for index in ranked_images_full])
    return result, image_features, result_full


def read_csv_into_list(csv_path, images):
    df = pd.read_csv(csv_path)
    image_features_list = []

    for image in images:
        image_name = Path(image.name).name

        for index, row in df[df["ImageName"] == image_name].iterrows():
            image_features_str = row["ImageFeatures"]
            image_features = ast.literal_eval(image_features_str)
            list_f = []
            list_f.append(image_features)
            image_features_list.append(list_f)

    return image_features_list


