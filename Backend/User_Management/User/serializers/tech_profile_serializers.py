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
        fields = ('user_id', 'serviceCategories', 'serviceRegions', 'employeeCount', 
                  'bio', 'availability', 'yearsInBusiness', 'service_ids')

class UpdateTechnicalProfileSerializer(serializers.ModelSerializer):
    service_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False
    )

    class Meta:
        model = TechnicalProfile
        fields = ('serviceCategories', 'serviceRegions', 'employeeCount', 
                  'bio', 'availability', 'yearsInBusiness', 'service_ids')

class TechnicalProfileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalProfile
        fields = '__all__'
        depth = 1