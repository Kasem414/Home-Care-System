from django.urls import path,include
from rest_framework.routers import DefaultRouter
from service_app.views import service_mgmt,service_request,service_offer,customer_offers,provider_requests

# Create router and register our viewsets with it 
router = DefaultRouter()
router.register(r'service-categories',service_mgmt.ServiceCategoryViewSet,basename='service-categories')
router.register(r'service-requests', service_request.ServiceRequestViewSet, basename='service-request')
router.register(r'offers',service_offer.ServiceOfferViewSet,basename='offers')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('service-requests/create/',service_request.ServiceRequestCreateView.as_view(),name='create-service-request'),
    path('service-requests/<int:request_id>/update/',service_request.ServiceRequestUpdateView.as_view(),name='update-service-request'),
    path("customer/offers/", customer_offers.CustomerOffersView.as_view(), name="customer-offers-another-way"),
    path("requests/<int:request_id>/offers/", customer_offers.RequestOffersListView.as_view(), name="customer-offers-list"),
    path("requests/<int:request_id>/offers/<int:offer_id>/accept/", customer_offers.AcceptOfferView.as_view(), name="accept-offer"),
    path("provider/requests/", provider_requests.ProviderRequestListView.as_view(), name="provider-request-list"),
    path("provider/requests/<int:request_id>/", provider_requests.ProviderRequestDetailView.as_view(), name="provider-request-detail"),
    path("", include(router.urls))
]




