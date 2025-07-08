import jwt
#from rest_framework import permissions
from rest_framework.exceptions import AuthenticationFailed
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class BaseRolePermission():
    required_roles = []

    def has_permission(self, request, view):
 
        cookie_header = request.headers.get('Authorization') 
         
        if not cookie_header :
            raise AuthenticationFailed("you are not loged in")

        # Extract the token from the Cookie header
        token = cookie_header.split('=')[1]   
        
        try:
            if not token :  
                 raise AuthenticationFailed("you are not loged in")
 
        except IndexError:
            raise AuthenticationFailed("Invalid token format")

         
      
       
        try:  
            payload = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])  # Decode the token
        
            user_role = payload.get('role')  # Get the role from the token
         
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed (f'Invalid token: {str(e)}')
        

        return user_role in self.required_roles

class IsUser(BaseRolePermission):
    def __init__(self):
         self.required_roles = ['customer','service_provider','administrator']
            
class IsCustomer(BaseRolePermission):
    def __init__(self):
         self.required_roles = ['customer']


class IsServiceProvider(BaseRolePermission):
    def __init__(self):
        self.required_roles = ['service_provider']


class IsAdministrator(BaseRolePermission):
   def __init__(self):
        self.required_roles = ['administrator']


 