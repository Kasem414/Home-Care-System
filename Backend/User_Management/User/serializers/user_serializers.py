from rest_framework import serializers
from ..models import Custom_User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom_User
        fields = [
            'id',
            'firstName',
            'lastName',
            'email',
            'phone',
            'role',
            'payment',
            'active',
        ]
