from django.urls import path
from ..views.tech_profile_views import CreateTechnicalProfileView, UpdateTechnicalProfileSerializer, UpdateTechnicalProfileView, DeleteTechnicalProfileView

urlpatterns = [
    path('tech-profiles/', CreateTechnicalProfileView.as_view(), name='create-tech-profile'), 
    path('tech-profiles/<int:user_id>/', UpdateTechnicalProfileView.as_view(), name='update-tech-profile'),
    path('tech-profiles/<int:user_id>/delete/', DeleteTechnicalProfileView.as_view(), name='delete-tech-profile'),
]
