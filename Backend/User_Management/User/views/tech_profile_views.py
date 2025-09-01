from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from User.serializers.tech_profile_serializers import CreateTechnicalProfileSerializer, UpdateTechnicalProfileSerializer, TechnicalProfileListSerializer
from ..repositories.tech_profile_repositories import TechProfileRepository
from ..services.tech_profile_services import TechProfileService
from django.core.exceptions import ObjectDoesNotExist

class BaseTechnicalProfileView(APIView):
    """Base view for technical profile operations."""
    permission_classes = [AllowAny]
    def __init__(self, **kwargs):
        super().__init__(**kwargs)  
        self.TechProfileService = TechProfileService(TechProfileRepository())

class CreateTechnicalProfileView(BaseTechnicalProfileView):
    """API endpoint that allows creation of a new technical profile."""
    
    @swagger_auto_schema(
        operation_description="Create a new technical profile",
        request_body=CreateTechnicalProfileSerializer,
        responses={
            201: openapi.Response('Created', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Success message')
                }
            )),
            400: "Bad request - validation error"
        }
    )
    def post(self, request):
        """
        Create a new technical profile.
        """
        serializer = CreateTechnicalProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = self.TechProfileService.create_profile(serializer.validated_data)
            return Response({"message": "Technical profile created successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateTechnicalProfileView(BaseTechnicalProfileView):
    """API endpoint that allows a technical profile to be updated."""
    
    @swagger_auto_schema(
        operation_description="Update an existing technical profile",
        request_body=UpdateTechnicalProfileSerializer,
        responses={
            200: openapi.Response('Success', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Success message')
                }
            )),
            404: "Profile not found",
            400: "Bad request - validation error"
        }
    )
    def put(self, request, user_id):
        """
        Update an existing technical profile.
        """
        try:
            profile = self.TechProfileService.update_profile(user_id, request.data)
            return Response({"message": "Technical profile updated successfully."})
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteTechnicalProfileView(BaseTechnicalProfileView):
    """API endpoint that allows a technical profile to be deleted."""
    
    @swagger_auto_schema(
        operation_description="Delete a technical profile",
        responses={
            204: "No content - successful deletion",
            404: "Profile not found",
            400: "Bad request"
        }
    )
    def delete(self, request, user_id):
        """
        Delete a technical profile.
        """
        try:
            self.TechProfileService.delete_profile(user_id)
            return Response({"message": "Technical profile deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ListTechnicalProfilesView(BaseTechnicalProfileView):
    """API endpoint that allows all technical profiles to be viewed."""
    
    @swagger_auto_schema(
        operation_description="Get a list of all technical profiles",
        responses={
            200: TechnicalProfileListSerializer(many=True)
        }
    )
    def get(self, request):
        """
        Get a list of all technical profiles.
        """
        profiles = self.TechProfileService.get_all_profiles()
        serializer = TechnicalProfileListSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RetrieveTechnicalProfileView(BaseTechnicalProfileView):
    """API endpoint that allows a specific technical profile to be retrieved by ID."""
    
    @swagger_auto_schema(
        operation_description="Get a specific technical profile by ID",
        responses={
            200: TechnicalProfileListSerializer,
            404: "Profile not found"
        }
    )
    def get(self, request, pk):
        """
        Get a specific technical profile by ID.
        """
        from ..models import TechnicalProfile
        try:
            profile = TechnicalProfile.objects.get(pk=pk)
        except TechnicalProfile.DoesNotExist:
            return Response({'error': 'TechnicalProfile not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TechnicalProfileListSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RetrieveTechnicalProfileByUserView(BaseTechnicalProfileView):
    """API endpoint that allows a technical profile to be retrieved by user ID."""
    
    @swagger_auto_schema(
        operation_description="Get a technical profile by user ID",
        responses={
            200: TechnicalProfileListSerializer,
            404: "Profile not found"
        }
    )
    def get(self, request, user_id):
        """
        Get a technical profile by user ID.
        """
        from ..models import TechnicalProfile
        try:
            profile = TechnicalProfile.objects.get(user_id=user_id)
        except TechnicalProfile.DoesNotExist:
            return Response({'error': 'TechnicalProfile not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TechnicalProfileListSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
