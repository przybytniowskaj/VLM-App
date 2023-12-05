from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
from .serializers import SignUpSerializer


############## Serializers test ##################

class SignUpSerializerTest(TestCase):
    def test_valid_data(self):
        data = {"email": "test@example.com", "username": "testuser", "password": "testpassword"}
        serializer = SignUpSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_existing_email(self):
        User.objects.create(email="test@example.com", username="existinguser")
        data = {"email": "test@example.com", "username": "testuser", "password": "testpassword"}
        serializer = SignUpSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertEqual(context.exception.detail["errors"][0], str('Email has already been used'))

    def test_invalid_password(self):
        data = {"email": "test@example.com", "username": "testuser", "password": "short"}
        serializer = SignUpSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertEqual(context.exception.detail["password"][0], str("Ensure this field has at least 8 characters."))


############## Models test ##################

class UserModelTest(TestCase):
    def test_user_str_method(self):
        user = User(email="test@example.com", password="password", username="testuser")
        self.assertEqual(str(user), "testuser")

class CustomUserManagerTest(TestCase):

    def test_create_user(self):
        manager = get_user_model().objects
        user = manager.create_user(email="test@example.com", password="password", username="testuser")
        
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.username, "testuser")
        self.assertTrue(user.check_password("password"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        manager = get_user_model().objects
        admin_user = manager.create_superuser(email="admin@example.com", password="adminpassword", username="adminuser")
        
        self.assertEqual(admin_user.email, "admin@example.com")
        self.assertEqual(admin_user.username, "adminuser")
        self.assertTrue(admin_user.check_password("adminpassword"))
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

class UserTest(TestCase):

    def test_user_creation(self):
        user = get_user_model().objects.create_user(
            email="test@example.com",
            password="password",
            username="testuser",
            date_of_birth="2000-01-01"
        )

        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.username, "testuser")
        self.assertTrue(user.check_password("password"))
        self.assertEqual(user.date_of_birth, "2000-01-01")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_superuser_creation(self):
        admin_user = get_user_model().objects.create_superuser(
            email="admin@example.com",
            password="adminpassword",
            username="adminuser"
        )

        self.assertEqual(admin_user.email, "admin@example.com")
        self.assertEqual(admin_user.username, "adminuser")
        self.assertTrue(admin_user.check_password("adminpassword"))
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_user_string_representation(self):
        user = get_user_model().objects.create_user(
            email="test@example.com",
            password="password",
            username="testuser"
        )

        self.assertEqual(str(user), "testuser")


############## Views test ##################

class SignUpViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse('signup')

    def test_signup_view(self):
        User = get_user_model()
        data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "password"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, "test@example.com")
