from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import Classifier, SemanticImageSearch, UserCaptionChoices, UserSearchChoices, Image

class ClassifierViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_classifier_list(self):
        url = reverse('classifier-list') 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.request['PATH_INFO'], '/api/classifier/')

class UserCaptionChoicesViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_user_caption_choices_list(self):
        url = reverse('user-caption-choices-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.request['PATH_INFO'], '/api/user-caption-choices/')

class UserSearchChoicesViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_user_search_choices_list(self):
        url = reverse('user-search-choices-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.request['PATH_INFO'], '/api/user-search-choices/')

class UserCaptionChoicesModelTest(TestCase):
    def setUp(self):
        self.caption_choice = UserCaptionChoices.objects.create(
            image_path="example_image_path.jpg",
            caption="Example caption"
        )

    def test_caption_str_representation(self):
        self.assertEqual(str(self.caption_choice), "Caption for example_image_path.jpg")

class UserSearchChoicesModelTest(TestCase):
    def setUp(self):
        self.search_choice = UserSearchChoices.objects.create(
            image_path="example_image_path.jpg",
            phrase="Example phrase"
        )

    def test_search_str_representation(self):
        self.assertEqual(str(self.search_choice), "Search for Example phrase")

class ClassifierModelTest(TestCase):
    def setUp(self):
        self.classifier = Classifier.objects.create(
            image=r'/flickr/667626_18933d713e.jpg',
            result='Example result'
        )

    def test_classifier_str_representation(self):
        expected_representation = f'Image classfied at {self.classifier.date_uploaded.strftime("%Y-%m-%d %H:%M")}'
        self.assertEqual(str(self.classifier), expected_representation)


class ImageModelTest(TestCase):
    def setUp(self):
        self.image = Image.objects.create(
            image=r'/flickr/667626_18933d713e.jpg'
        )

    def test_image_str_representation(self):
        expected_representation = '/media/flickr/667626_18933d713e.jpg'
        self.assertEqual(str(self.image), expected_representation)

class SemanticImageSearchModelTest(TestCase):
    def setUp(self):
        self.semantic_search = SemanticImageSearch.objects.create(
            query='Example query',
            result='Example result',
            result_full='Example full result'
        )

    def test_semantic_search_str_representation(self):
        expected_representation = f'Semantic search for "Example query" - {self.semantic_search.date_uploaded.strftime("%Y-%m-%d %H:%M")}'
        self.assertEqual(str(self.semantic_search), expected_representation)