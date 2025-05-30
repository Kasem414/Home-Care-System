from rest_framework import viewsets, status
from rest_framework.response import Response
from service_app.serializers.service_mgmt import ServiceCategorySerializer
from service_app.repositories.service_category_repository import ServiceCategoryRepository
from drf_yasg.utils import swagger_auto_schema
from service_app.tasks import publish_service_category_event
from service_app.pagination import CustomPagePagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

pagination_parameters = [
    openapi.Parameter('page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER),
    openapi.Parameter('limit', openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER),
]


class ServiceCategoryViewSet(viewsets.ViewSet):
    """
    ViewSet to handle CRUD operations for ServiceCategory.
    Only Admin users can create, update, or delete categories.
    """

    @swagger_auto_schema(
        manual_parameters=pagination_parameters,
        operation_description="Retrieve a paginated list of service categories."
    )
    def list(self, request):
        """
        Retrieve all service categories.
        Open to all authenticated users (admin, worker, customer).
        """
        categories = ServiceCategoryRepository.list_categories()
        paginator = CustomPagePagination()
        result_page = paginator.paginate_queryset(categories,request)
        serializer = ServiceCategorySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    @swagger_auto_schema(request_body=ServiceCategorySerializer)
    def create(self, request):
        """
        Create a new service category.
        Only accessible by Admin users.
        """
        # role = request.headers.get('X-User-Role')
        # if role != "Adminstrator":
        #     return Response({"detail": "Only Admins can create categories."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ServiceCategorySerializer(data=request.data)
        if serializer.is_valid():
            try:
                category = ServiceCategoryRepository.create_category(
                    name=serializer.validated_data['name'],
                    description=serializer.validated_data.get('description', '')
                )
                publish_service_category_event.delay(event_type='created',category_id=str(category.id),name=category.name,description=category.description)
                response_serializer = ServiceCategorySerializer(category)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single service category by ID.
        """
        category = ServiceCategoryRepository.get_category_by_id(pk)
        if category:
            serializer = ServiceCategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Service Category not found."}, status=status.HTTP_404_NOT_FOUND)
    @swagger_auto_schema(request_body=ServiceCategorySerializer)
    def update(self, request, pk=None):
        """
        Update a service category.
        """
        category = ServiceCategoryRepository.get_category_by_id(pk)
        if not category:
            return Response({"detail": "Service Category not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceCategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            updated_category = ServiceCategoryRepository.update_category(
                category,
                name=serializer.validated_data.get('name'),
                description=serializer.validated_data.get('description')
            )
            publish_service_category_event.delay(event_type='updated',category_id=str(updated_category.id),name=updated_category.name,description=updated_category.description)
            response_serializer = ServiceCategorySerializer(updated_category)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Delete a service category.
        """
        category = ServiceCategoryRepository.get_category_by_id(pk)
        if not category:
            return Response({"detail": "Service Category not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            category_id = str(category.id)
            category_name = category.name
            ServiceCategoryRepository.delete_category(category)
            publish_service_category_event.delay(event_type='deleted',category_id=category_id,name=category_name)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def partial_update(self,request,pk=None):
        return self.update(self,request,pk)