from django.urls import path, include

urlpatterns = [
    path('', include('User.urls.user_url')),
    path('', include('User.urls.tech_profile_url')),
]
