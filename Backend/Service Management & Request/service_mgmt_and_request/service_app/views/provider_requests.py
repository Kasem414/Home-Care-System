from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from ..models import ServiceRequest, ServiceOffer, UserProfile
from ..serializers.service_request_serializer import ServiceRequestSerializer
from ..repositories.service_request_repository import ServiceRequestRepository
from ..pagination import CustomPagePagination
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class ProviderRequestListView(APIView):
    @swagger_auto_schema(
        operation_summary="List requests visible to a provider",
        operation_description="Returns a list of requests matching the serviceType. If showNewOnly is true, only unmatched requests will be returned.",
        manual_parameters=[
            openapi.Parameter(
                'X-User-Id',
                openapi.IN_HEADER,
                description="Authenticated provider's ID",
                type=openapi.TYPE_INTEGER,
                required=True
            ),
            openapi.Parameter(
                'serviceType',
                openapi.IN_QUERY,
                description="Filter by service type (e.g., plumbing)",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'showNewOnly',
                openapi.IN_QUERY,
                description="Only show requests without existing offers from this provider (true/false)",
                type=openapi.TYPE_BOOLEAN
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="Page number for pagination",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER
            )
        ],
        responses={
            200: openapi.Response(
                description="List of service requests", 
            )
        }
    )
    def get(self, request):
        # Get providerId from query param or JWT header
        provider_id = request.query_params.get("providerId") or request.headers.get("X-User-Id")

        if not provider_id:
            return Response({
                "message": "providerId is required either in query params or JWT headers.",
                "status_code": 400
            }, status=400)

        # Optional filters
        service_type = request.query_params.get("serviceType")
        show_new_only = request.query_params.get("showNewOnly") == "true"

        # Get provider profile (to filter by region/city if needed)
        try:
            provider_profile = UserProfile.objects.get(id=provider_id)
        except UserProfile.DoesNotExist:
            return Response({
                "message": "Provider profile not found.",
                "status_code": 404
            }, status=404)

        queryset = ServiceRequestRepository.get_all()

        # Filter by service type
        if service_type:
            queryset = queryset.filter(service_type__name__iexact=service_type)

        # Optional: region/city match (if needed)
        queryset = queryset.filter(
            city__iexact=provider_profile.city,
            region__iexact=provider_profile.region
        )

        # Exclude already offered requests
        if show_new_only:
        #  Filter base
            queryset = queryset.filter(status="submitted")
            # Find all request_ids that this provider has already made offers on, and exclude them.
            # values_list() is a Django QuerySet method that returns a list (or tuples) 
            # of specific field values from the database, instead of returning full model instances.
            offered_ids = ServiceOffer.objects.filter(provider_id=provider_id).values_list('request_id', flat=True)
            queryset = queryset.exclude(id__in=offered_ids)

        paginator = CustomPagePagination()
        result_page = paginator.paginate_queryset(queryset, request)
        serialized = ServiceRequestSerializer(result_page, many=True, context={"request": request})
        return paginator.get_paginated_response(serialized.data)


class ProviderRequestDetailView(APIView):
    @swagger_auto_schema(
        operation_summary="Get service request details for provider",
        manual_parameters=[
            openapi.Parameter(
                'X-User-Id',
                openapi.IN_HEADER,
                description="Authenticated provider's ID",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Service request and customer info",
            ),
            404: "Not found",
            403: "Forbidden"
        }
    )
    def get(self, request, request_id):
        provider_id = request.headers.get("X-User-Id")

        # Optional: Validate provider_id is provided
        if not provider_id:
            return Response({
                "message": "Provider ID is required in headers (X-User-Id)."
            }, status=status.HTTP_400_BAD_REQUEST)

        service_request = get_object_or_404(ServiceRequest, id=request_id)
        customer_profile = UserProfile.objects.filter(id=service_request.customer_id).first()

        response_data = {
            "id": service_request.id,
            "serviceType": service_request.service_type.name if service_request.service_type else None,
            "status": service_request.status,
            "createdAt": service_request.created_at,
            "preferredDate": service_request.preferred_date,
            "preferredTime": service_request.preferred_time,
            "flexibleDays": service_request.flexible_schedule_days,
            "flexibleTimes": service_request.flexible_time_slots,
            "address": {
                "city": service_request.city,
                "region": service_request.region,
                "additional_info": service_request.additional_info,
            },
            "description": service_request.description,
            "budget": {
                "type": service_request.budget_type,
                "min": service_request.budget_min_hourly,
                "max": service_request.budget_max_hourly,
                "fixed": service_request.fixed_price_offer
            },
            "client": {
                "id": customer_profile.id if customer_profile else None,
                "name": customer_profile.name if customer_profile else None,
                # "rating": customer_profile.rating if customer_profile else None,
                # "reviewCount": customer_profile.review_count if customer_profile else 0
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)