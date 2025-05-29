from django.urls import path
from .views import RegisterServiceProviderView, RegisterView, LoginView 

urlpatterns = [
    path('register/homeowner', RegisterView.as_view(), name='register'),
    path('register/provider', RegisterServiceProviderView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'), 
]
