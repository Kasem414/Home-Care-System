from rest_framework.views import APIView
from ..services.user_services import UserService
from ..services.tech_profile_services import TechProfileService
from ..repositories.user_repositories import UserRepository
from ..repositories.tech_profile_repositories import TechProfileRepository
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from ..models import Custom_User
from rest_framework.pagination import PageNumberPagination
from ..serializers.user_serializers  import UserSerializer, UserDetailSerializer
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class UserBaseView(APIView):
    """Base view for user-related operations."""
    permission_classes = [AllowAny]
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_service = UserService(UserRepository())
        self.tech_profile_service = TechProfileService(TechProfileRepository())

class CustomPagination(PageNumberPagination):
    """Custom pagination for user listings."""
    page_size = 10   
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_pages = (self.page.paginator.count + self.page_size - 1) // self.page_size
        
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': total_pages,   
            'results': data
        })

class ListUsersView(UserBaseView):
    """API endpoint that allows users to be viewed with pagination."""
    pagination_class = CustomPagination
    
    @swagger_auto_schema(
        operation_description="Get a paginated list of all users",
        responses={200: openapi.Response('Successful response', UserSerializer(many=True))}
    )
    def get(self, request):
        """
        Get a paginated list of all users.
        """
        users = self.user_service.list_users()
        paginator = self.pagination_class()
        paginated_users = paginator.paginate_queryset(users, request)
        serialized = UserSerializer(paginated_users, many=True) 
        return paginator.get_paginated_response(UserSerializer(paginated_users, many=True).data)

class ListUsersNoPaginationView(UserBaseView):
    """API endpoint that allows all users to be viewed without pagination."""
    
    @swagger_auto_schema(
        operation_description="Get a list of all users without pagination",
        responses={200: UserSerializer(many=True)}
    )
    def get(self, request):
        """
        Get a list of all users without pagination.
        """
        users = self.user_service.list_users()
        serialized = UserSerializer(users, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)

class UpdateUserView(UserBaseView):
    """API endpoint that allows a user to be updated."""
    
    @swagger_auto_schema(
        operation_description="Update a specific user by ID",
        request_body=UserSerializer,
        responses={
            200: UserSerializer,
            404: "User not found"
        }
    )
    def put(self, request, user_id):
        """
        Update a specific user by ID.
        """
        user = self.user_service.update_user(user_id, request.data)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class DeleteUserView(UserBaseView):
    """API endpoint that allows a user to be deleted."""
    
    @swagger_auto_schema(
        operation_description="Delete a specific user by ID",
        responses={
            204: "No content - successful deletion",
            404: "User not found"
        }
    )
    def delete(self, request, user_id):
        """
        Delete a specific user by ID.
        """
        self.user_service.delete_user(user_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

class SearchUserView(UserBaseView):
    """API endpoint that allows a user to be searched by ID."""
    
    @swagger_auto_schema(
        operation_description="Search for a specific user by ID",
        responses={
            200: UserSerializer,
            404: "User not found"
        }
    )
    def get(self, request, user_id):
        """
        Search for a specific user by ID.
        """
        user = self.user_service.search_users(user_id)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class UpdateAccountView(UserBaseView):
    """API endpoint that allows a user account to be updated."""
    
    @swagger_auto_schema(
        operation_description="Update a user's account profile",
        request_body=UserSerializer,
        responses={
            200: UserSerializer,
            404: "User not found"
        }
    )
    def put(self, request, user_id):
        """
        Update a user's account profile.
        """
        user = self.user_service.update_profile(user_id, request.data)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class DeleteAccountView(UserBaseView):
    """API endpoint that allows a user account to be deleted."""
    
    @swagger_auto_schema(
        operation_description="Delete a user's account",
        responses={
            204: "No content - successful deletion",
            404: "User not found"
        }
    )
    def delete(self, request, user_id):
        """
        Delete a user's account.
        """
        self.user_service.delete_profile(user_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ActivateUserView(UserBaseView):
    """API endpoint that allows a user to be activated."""
    
    @swagger_auto_schema(
        operation_description="Activate a user account",
        responses={
            200: openapi.Response('Successful activation', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'status': openapi.Schema(type=openapi.TYPE_STRING, description='Activation status')
                }
            )),
            404: "User not found"
        }
    )
    def post(self, request, user_id):
        """
        Activate a user account.
        """
        self.user_service.update_user(user_id, {"active": True})
        return Response({"status": "activated"}, status=status.HTTP_200_OK)

class DeactivateUserView(UserBaseView):
    """API endpoint that allows a user to be deactivated."""
    
    @swagger_auto_schema(
        operation_description="Deactivate a user account",
        responses={
            200: openapi.Response('Successful deactivation', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'status': openapi.Schema(type=openapi.TYPE_STRING, description='Deactivation status')
                }
            )),
            404: "User not found"
        }
    )
    def post(self, request, user_id):
        """
        Deactivate a user account.
        """
        self.user_service.update_user(user_id, {"active": False})
        return Response({"status": "deactivated"}, status=status.HTTP_200_OK)

class UpdateWorkStateView(UserBaseView):
    """API endpoint that allows a technician's work state to be updated."""
    
    @swagger_auto_schema(
        operation_description="Update a technician's work state",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['work_state'],
            properties={
                'work_state': openapi.Schema(type=openapi.TYPE_STRING, description='New work state')
            }
        ),
        responses={
            200: openapi.Response('Successful update', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'status': openapi.Schema(type=openapi.TYPE_STRING, description='Update status')
                }
            )),
            404: "User not found"
        }
    )
    def put(self, request, user_id):
        """
        Update a technician's work state.
        """
        self.tech_profile_service.update_profile(user_id, {"work_state": request.data.get("work_state")})
        return Response({"status": "updated"}, status=status.HTTP_200_OK)

class UpdateTechProfileView(UserBaseView):
    """API endpoint that allows a technician's profile to be updated."""
    
    @swagger_auto_schema(
        operation_description="Update a technician's profile",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={}  # This would be filled with actual properties from your tech profile model
        ),
        responses={
            200: openapi.Response('Successful update', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'status': openapi.Schema(type=openapi.TYPE_STRING, description='Update status')
                }
            )),
            404: "User not found"
        }
    )
    def put(self, request, user_id):
        """
        Update a technician's profile.
        """
        profile = self.tech_profile_service.update_profile(user_id, request.data)
        return Response({"status": "updated"}, status=status.HTTP_200_OK)

class GetMeView(UserBaseView):
    """API endpoint that allows a user to retrieve their own details."""
    
    @swagger_auto_schema(
        operation_description="Get current user's detailed information",
        responses={
            200: UserDetailSerializer,
            404: "User not found"
        }
    )
    def get(self, request, user_id):
        """
        Get current user's detailed information.
        """
        user = self.user_service.search_users(user_id)
        return Response(UserDetailSerializer(user).data, status=status.HTTP_200_OK)

class GetMyPaymentStateView(UserBaseView):
    """API endpoint that allows a user to retrieve their payment state."""
    
    @swagger_auto_schema(
        operation_description="Get current user's payment state",
        responses={
            200: openapi.Response('Payment state', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'payment': openapi.Schema(type=openapi.TYPE_STRING, description='Payment state')
                }
            )),
            404: "User not found"
        }
    )
    def get(self, request, user_id):
        """
        Get current user's payment state.
        """
        user = self.user_service.search_users(user_id)
        return Response({"payment": user.payment}, status=status.HTTP_200_OK)



