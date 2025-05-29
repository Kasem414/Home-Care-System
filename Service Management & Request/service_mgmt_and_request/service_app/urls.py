from django.urls import path,include
from rest_framework.routers import DefaultRouter
from service_app.views import service_mgmt,service_request 

# Create router and register our viewsets with it 
router = DefaultRouter()
router.register(r'service-categories',service_mgmt.ServiceCategoryViewSet,basename='service-categories')
router.register(r'service-requests', service_request.ServiceRequestViewSet, basename='service-request')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('service-requests/create/',service_request.ServiceRequestCreateView.as_view(),name='create-service-request'),
    path('service-requests/<int:request_id>/update/',service_request.ServiceRequestUpdateView.as_view(),name='update-service-request'),
    path("", include(router.urls))
]




