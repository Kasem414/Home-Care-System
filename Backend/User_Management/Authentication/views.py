from django.shortcuts import render
from rest_framework import status 
from rest_framework.views import APIView
from .services import AuthService
from rest_framework.response import Response
from User.repositories.user_repositories import UserRepository  
from .serializers import RegisterSerializer,LoginSerializer, RegisterServiceProviderSerializer
from rest_framework.exceptions import AuthenticationFailed

class BaseAuthView(APIView):
    # 👇 Initialize the parent class (important in DRF)
    def __init__(self):   
        # ✅ Dependency Injection (manual)
        # Create an instance of UserRepository (data access logic)
        # Inject it into AuthService (business/auth logic)
        # Store the service instance for use in all child views
        self.AuthService = AuthService(UserRepository())
        # This avoids repeating the same setup in every view (e.g., login, register, etc.)
class RegisterView(BaseAuthView):
    def post(self, request):
        print(123)
        serializer = RegisterSerializer(data=request.data)
       # print(serializer)
        if serializer.is_valid():
            try:
                print(1234)
                token_data = self.AuthService.register_user_with_location(serializer)
                response = Response(token_data, status=status.HTTP_201_CREATED)
                return response
            except Exception as e:
                print(f"Registration Error: {str(e)}") 
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(BaseAuthView):
    def post(self, request):
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
    def post(self, request):
        serializer = RegisterServiceProviderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token_data = self.AuthService.register_service_provider_with_profile(serializer)
                return Response(token_data, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"Service Provider Registration Error: {str(e)}") 
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    