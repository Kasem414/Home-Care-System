from rest_framework import serializers
from ..models import ServiceRequest, ServiceRequestAttachment,ServiceCategory
from decimal import Decimal,InvalidOperation
import json, ast

class SafeListField(serializers.ListField):
    def to_internal_value(self, data):
        import json, ast

        # If wrapped in list of one string
        if isinstance(data, list) and len(data) == 1 and isinstance(data[0], str):
            try:
                parsed = json.loads(data[0])
                if isinstance(parsed, list):
                    data = parsed
            except:
                try:
                    parsed = ast.literal_eval(data[0])
                    if isinstance(parsed, list):
                        data = parsed
                except:
                    pass

        # Remove None or empty string from the list
        if isinstance(data, list):
            data = [item for item in data if item not in [None, "", "null"]]

        return super().to_internal_value(data)

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

    flexible_schedule_days = SafeListField(child=serializers.CharField(), required=False)
    flexible_time_slots = SafeListField(child=serializers.CharField(), required=False)
    preferred_qualifications = SafeListField(child=serializers.CharField(), required=False)

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'customer_id', 'service_type',
            'city', 'region', 'additional_info',
            'preferred_date', 'preferred_time', 'schedule_type',
            'flexible_schedule_days', 'flexible_time_slots',
            'description', 'budget_type', 'budget_min_hourly',
            'budget_max_hourly', 'fixed_price_offer',
            'preferred_qualifications', 'status',
            'matched_provider_id', 'auto_expire_at', 'created_at',
            'attachments'
        ]
        read_only_fields = [
            'id', 'created_at', 'status',
            'matched_provider_id', 'auto_expire_at'
        ]

    # def to_internal_value(self, data):
    #     # Flatten keys from nested frontend structure
    #     data.update({
    #         'city': data.get('location[city]'),
    #         'region': data.get('location[region]'),
    #         'additional_info': data.get('location[additional_info]'),

    #         'preferred_date': data.get('schedule[preferredDate]'),
    #         'preferred_time': data.get('schedule[preferredTime]'),
    #         'schedule_type': data.get('schedule[flexibility]'),
    #         'flexible_schedule_days': data.get('schedule[flexibleDays]'),
    #         'flexible_time_slots': data.get('schedule[flexibleTimes]'),

    #         'description': data.get('requirements[description]'),
    #         'budget_type': data.get('requirements[budget][type]'),
    #         'budget_min_hourly': data.get('requirements[budget][min]'),
    #         'budget_max_hourly': data.get('requirements[budget][max]'),
    #         'fixed_price_offer': data.get('requirements[budget][fixed_price_offer]'),
    #         'preferred_qualifications': data.get('requirements[preferredQualifications]'),
    #     })
    #     return super().to_internal_value(data)
    def validate(self, attrs):
        schedule_type = attrs.get('schedule_type')

        if schedule_type == 'specific':
            if not attrs.get('preferred_date') or not attrs.get('preferred_time'):
                raise serializers.ValidationError({
                    "preferred_date": "This field is required when schedule_type is 'specific'.",
                    "preferred_time": "This field is required when schedule_type is 'specific'."
                })

        elif schedule_type == 'flexible':
            if not attrs.get('flexible_schedule_days') or not attrs.get('flexible_time_slots'):
                raise serializers.ValidationError({
                    "flexible_schedule_days": "This field is required when schedule_type is 'flexible'.",
                    "flexible_time_slots": "This field is required when schedule_type is 'flexible'."
                })

        return attrs