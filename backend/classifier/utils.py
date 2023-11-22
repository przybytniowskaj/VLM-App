from transformers import CLIPProcessor, CLIPModel
import torch
import clip
from PIL import Image

def perform_semantic_search(query, images):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-L/14", device=device)

    image_features = []
    image_paths = []
    for image in images:
        image_paths.append(image)
        image = image.temporary_file_path()
        
        image_preprocessed = preprocess(Image.open(image)).unsqueeze(0).to(device)
        image_features.append(model.encode_image(image_preprocessed))
    
    text_preprocessed = clip.tokenize([query]).to(device)
    text_features = model.encode_text(text_preprocessed)

    similarities = []
    for image_feature in image_features:
        similarity = torch.nn.functional.cosine_similarity(text_features, image_feature, dim=1)
        similarities.append(similarity.item())

    threshold = 0.15
    filtered_similarities = [index for index, sim in enumerate(similarities) if sim > threshold]
    ranked_images = sorted(filtered_similarities, key=lambda x: similarities[x], reverse=True)

    result = ', '.join([f"{index}" for index in ranked_images])
    print(result)
    return result