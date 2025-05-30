from rest_framework import serializers
from service_app.models import ServiceOffer,ServiceRequest
from service_app.repositories.service_request_repository import ServiceRequestRepository

class ServiceOfferSerializer(serializers.ModelSerializer):
    # Incoming fields (camelCase to model)
    requestId = serializers.IntegerField(source='request_id')
    providerId = serializers.IntegerField(source='provider_id')
    availableDate = serializers.DateField(source='available_date')
    availableTime = serializers.TimeField(source='available_time')
    estimatedDuration = serializers.DecimalField(source='estimated_duration', max_digits=4, decimal_places=2)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    # Read-only serviceType from request.service_type.name
    serviceType = serializers.SerializerMethodField()

    class Meta:
        model = ServiceOffer
        fields = [
            'id', 'requestId', 'providerId', 'price',
            'availableDate', 'availableTime', 'estimatedDuration',
            'materials', 'description', 'status',
            'auto_expire_at', 'createdAt', 'serviceType'
        ]
        read_only_fields = ['id', 'createdAt', 'status','auto_expire_at','serviceType']

    def get_serviceType(self, obj):
        try:
            return obj.request.service_type.name
        except:
            return None
    def create(self, validated_data):
        return ServiceOffer.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

