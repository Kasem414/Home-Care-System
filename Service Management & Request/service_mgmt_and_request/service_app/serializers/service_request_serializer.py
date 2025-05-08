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
    category = serializers.PrimaryKeyRelatedField(queryset=ServiceCategory.objects.all())
    category_name = serializers.ReadOnlyField(source='category.name')
    # budget_min_hourly = serializers.DecimalField(source='min')
    # budget_max_hourly = serializers.DecimalField(source='max')
    # fixed_price_offer = serializers.DecimalField(source='')
    class Meta:
        model = ServiceRequest
        fields = [
            'id',
            'customer_id',
            'category',
            'description',
            'street_address',
            'city',
            'region',
            'additionalInfo',
            'preferredDate',
            'preferredTime',
            'flexibleDays',
            'flexibleTimes',
            'budget_min_hourly',
            'budget_max_hourly',
            'fixed_price_offer',
            'latitude',
            'longitude',
            'status',
            'matched_provider_id',
            'auto_expire_at',
            'created_at',
            'attachments',
            'preferredQualifications',
            'category_name'
        ]
        read_only_fields = ['status', 'matched_provider_id', 'auto_expire_at', 'created_at']

    def validate(self, data):
        if self.partial:
            return data
        has_fixed = data.get('preferred_date') and data.get('preferred_time')
        has_flexible = data.get('flexible_schedule_days') and data.get('flexible_time_slots')

        if not has_fixed and not has_flexible:
            raise serializers.ValidationError("Either fixed schedule or flexible schedule must be provided.")

        if has_fixed and has_flexible:
            raise serializers.ValidationError("Either fixed schedule or flexible schedule must be provided, not both.")

        if (data.get('budget_min_hourly') and data.get('budget_max_hourly')) and (
            data['budget_min_hourly'] > data['budget_max_hourly']
        ):
            raise serializers.ValidationError("Minimum hourly rate must not exceed maximum hourly rate.")

        return data