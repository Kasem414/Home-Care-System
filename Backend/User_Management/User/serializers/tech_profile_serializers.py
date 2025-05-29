from rest_framework import serializers
from ..models import TechnicalProfile

class CreateTechnicalProfileSerializer(serializers.ModelSerializer):
    service_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False
    )
    user_id = serializers.IntegerField()

    class Meta:
        model = TechnicalProfile
        fields = ('user_id', 'category', 'rate', 'work_state', 'service_ids')

class UpdateTechnicalProfileSerializer(serializers.ModelSerializer):
    service_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False
    )

    class Meta:
        model = TechnicalProfile
        fields = ('category', 'rate', 'work_state', 'service_ids')