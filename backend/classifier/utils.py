from transformers import CLIPProcessor, CLIPModel
import torch
import clip
from PIL import Image

def perform_semantic_search(query, images):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-B/16", device=device)

    image_features = []
    for image in images:
        image = image.temporary_file_path()
        image_preprocessed = preprocess(Image.open(image)).unsqueeze(0).to(device)
        image_features.append(model.encode_image(image_preprocessed))

    text_preprocessed = clip.tokenize([query]).to(device)
    text_features = model.encode_text(text_preprocessed)
    
    similarities = []
    for image_feature in image_features:
        similarity = torch.nn.functional.cosine_similarity(text_features, image_feature, dim=1)
        similarities.append(similarity.item())

    # Rank images based on similarity
    ranked_images = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)
    # Update the result field
    # result = ', '.join([f"Image {index + 1}" for index, _ in ranked_images])
    # print('tutaj cos')
    return [x for x, y in ranked_images]