from django.urls import path
from ..views.tech_profile_views import CreateTechnicalProfileView, UpdateTechnicalProfileSerializer, UpdateTechnicalProfileView, DeleteTechnicalProfileView, ListTechnicalProfilesView, RetrieveTechnicalProfileView, RetrieveTechnicalProfileByUserView

urlpatterns = [
    path('tech-profiles/', CreateTechnicalProfileView.as_view(), name='create-tech-profile'), 
    path('tech-profiles/all/', ListTechnicalProfilesView.as_view(), name='list-tech-profiles'),
    path('tech-profiles/by-user/<int:user_id>/', RetrieveTechnicalProfileByUserView.as_view(), name='retrieve-tech-profile-by-user'),
    path('tech-profiles/<int:pk>/', RetrieveTechnicalProfileView.as_view(), name='retrieve-tech-profile'),
    path('tech-profiles/<int:user_id>/update/', UpdateTechnicalProfileView.as_view(), name='update-tech-profile'),
    path('tech-profiles/<int:user_id>/delete/', DeleteTechnicalProfileView.as_view(), name='delete-tech-profile'),
]
