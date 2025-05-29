# auth/serializers.py
from rest_framework import serializers
from User.models import Custom_User
from django.contrib.auth.hashers import make_password
 

class RegisterSerializer1(serializers.ModelSerializer):
    class Meta:
        model = Custom_User
        fields = ('email', 'name', 'role', 'phone','password','lat','')  

        
        extra_kwargs = {'password': {'write_only': True} 
                        }


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    region=serializers.CharField()
    phone = serializers.CharField(max_length=20)
    city = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, max_length=255)
    payment = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)
    active = serializers.BooleanField(required=False, default=True)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

 

class RegisterServiceProviderSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    phone = serializers.CharField()
    city = serializers.CharField()
    region = serializers.CharField()
    payment = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)
    active = serializers.BooleanField(default=True)
    
    # TechnicalProfile fields
    serviceRegions = serializers.ListField(child=serializers.CharField())
    serviceCategories = serializers.ListField(child=serializers.CharField())
    serviceRegions = serializers.ListField(child=serializers.CharField())
    employeeCount = serializers.CharField()
    bio = serializers.CharField()
    availability =  serializers.ListField(child=serializers.CharField())
    yearsInBusiness = serializers.CharField()