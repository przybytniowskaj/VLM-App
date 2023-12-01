from . import views
from django.urls import path 

urlpatterns = [
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("login/", views.LoginView.as_view(), name="login"),
    path('user-profile/', views.UserProfileAPIView.as_view(), name='user-profile'),
]