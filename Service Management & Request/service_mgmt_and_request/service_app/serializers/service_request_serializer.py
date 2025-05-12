from rest_framework import serializers
from ..models import ServiceRequest, ServiceRequestAttachment,ServiceCategory

class ServiceRequestAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequestAttachment
        fields = ['id', 'image', 'uploaded_at']
    def get_image(self,obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_url(obj.image.url)
        return obj.image.url


class ServiceRequestSerializer(serializers.ModelSerializer):
    attachments = ServiceRequestAttachmentSerializer(many=True, read_only=True)
    service_type = serializers.SlugRelatedField(
        slug_field='name',
        queryset=ServiceCategory.objects.all()
    )

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'customer_id', 'service_type', 'is_urgent',
            'street_address', 'city', 'region', 'additional_info',
            'latitude', 'longitude',
            'preferred_date', 'preferred_time', 'schedule_type',
            'flexible_schedule_days', 'flexible_time_slots',
            'description', 'budget_type', 'budget_min_hourly',
            'budget_max_hourly', 'fixed_price_offer',
            'preferred_qualifications', 'status',
            'matched_provider_id', 'auto_expire_at', 'created_at','attachments'
        ]
        read_only_fields = ['id', 'created_at','status',
            'matched_provider_id', 'auto_expire_at',]

    def to_internal_value(self, data):
        # Unpack nested structures
        location = data.pop('location', {})
        schedule = data.pop('schedule', {})
        requirements = data.pop('requirements', {})

        data.update({
            'street_address': location.get('street_address'),
            'city': location.get('city'),
            'region': location.get('region'),
            'additional_info': location.get('additional_info'),
            'latitude': location.get('latitude'),
            'longitude': location.get('longitude'),

            'preferred_date': schedule.get('preferredDate'),
            'preferred_time': schedule.get('preferredTime'),
            'schedule_type': schedule.get('flexibility'),
            'flexible_schedule_days': schedule.get('flexibleDays'),
            'flexible_time_slots': schedule.get('flexibleTimes'),

            'description': requirements.get('description'),
            'budget_type': (requirements.get('budget') or {}).get('type'),
            'budget_min_hourly': (requirements.get('budget') or {}).get('min'),
            'budget_max_hourly': (requirements.get('budget') or {}).get('max'),
            'fixed_price_offer': (requirements.get('budget') or {}).get('fixed_price_offer'),
            'preferred_qualifications': requirements.get('preferredQualifications')
        })

        return super().to_internal_value(data)