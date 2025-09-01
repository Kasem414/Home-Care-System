from django.shortcuts import render
from rest_framework import status 
from rest_framework.views import APIView
from .services import AuthService
from rest_framework.response import Response
from User.repositories.user_repositories import UserRepository  
from .serializers import RegisterSerializer, LoginSerializer, RegisterServiceProviderSerializer
from rest_framework.exceptions import AuthenticationFailed
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class BaseAuthView(APIView):
    """Base view for authentication operations."""
    def __init__(self):   
        # ✅ Dependency Injection (manual)
        # Create an instance of UserRepository (data access logic)
        # Inject it into AuthService (business/auth logic)
        # Store the service instance for use in all child views
        self.AuthService = AuthService(UserRepository())
        # This avoids repeating the same setup in every view (e.g., login, register, etc.)

class RegisterView(BaseAuthView):
    """API endpoint for user registration."""
    
    @swagger_auto_schema(
        operation_description="Register a new user",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response('Created', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='JWT access token'),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
                    'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID')
                }
            )),
            400: "Bad request - validation error"
        }
    )
    def post(self, request):
        """
        Register a new user with location information.
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token_data = self.AuthService.register_user_with_location(serializer)
                response = Response(token_data, status=status.HTTP_201_CREATED)
                return response
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(BaseAuthView):
    """API endpoint for user login."""
    
    @swagger_auto_schema(
        operation_description="Login with email and password",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response('Success', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='JWT access token'),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
                    'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
                    'user_type': openapi.Schema(type=openapi.TYPE_STRING, description='Type of user')
                }
            )),
            401: "Authentication failed",
            400: "Bad request - validation error"
        }
    )
    def post(self, request):
        """
        Login with email and password.
        """
        serializer = LoginSerializer(data=request.data)       
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
        
            try:         
                token_data = self.AuthService.login_user(email, password)
                response = Response(token_data, status=status.HTTP_200_OK)
                return response
            except AuthenticationFailed as e:
                return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class RegisterServiceProviderView(BaseAuthView):
    """API endpoint for service provider registration."""
    
    @swagger_auto_schema(
        operation_description="Register a new service provider",
        request_body=RegisterServiceProviderSerializer,
        responses={
            200: openapi.Response('Success', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='JWT access token'),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
                    'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID')
                }
            )),
            400: "Bad request - validation error"
        }
    )
    def post(self, request):
        """
        Register a new service provider with technical profile.
        """
        serializer = RegisterServiceProviderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token_data = self.AuthService.register_service_provider_with_profile(serializer)
                return Response(token_data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)