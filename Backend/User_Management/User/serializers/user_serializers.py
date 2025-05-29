from rest_framework import serializers
from ..models import Custom_User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom_User
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'payment',
            'active',
        ]
