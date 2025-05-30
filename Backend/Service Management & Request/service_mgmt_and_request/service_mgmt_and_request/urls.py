from django.contrib import admin
from django.urls import path,include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

# Configure Swagger Schema View
schema_view = get_schema_view(
   openapi.Info(
      title="Home Care System API",
      default_version='v1',
      description="API documentation for Service Management & Request microservice",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="support@homecare.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('service_app.urls')), # Link to service_app urls
     # Swagger and Redoc Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)