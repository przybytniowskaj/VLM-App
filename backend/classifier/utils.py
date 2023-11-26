from transformers import CLIPProcessor, CLIPModel
import torch
import clip
from PIL import Image
import json

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-L/14", device=device)

def perform_semantic_search(query, images, features):
    print(features)
    image_features = json.loads(features) if features is not None else []
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
    print(similarities)

    threshold = 0.15
    filtered_similarities = [index for index, sim in enumerate(similarities) if sim > threshold]
    ranked_images = sorted(filtered_similarities, key=lambda x: similarities[x], reverse=True)

    result = ', '.join([f"{index}" for index in ranked_images])
    print(result)
    return result, image_features