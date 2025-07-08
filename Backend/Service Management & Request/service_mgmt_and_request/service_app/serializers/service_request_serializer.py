from rest_framework import serializers
from ..models import ServiceRequest, ServiceRequestAttachment,ServiceCategory
from decimal import Decimal,InvalidOperation
from ..repositories.service_category_repository import ServiceCategoryRepository


# Custom ListField to handle stringified lists gracefully
class SafeListField(serializers.ListField):
    """
    A custom ListField that tries to fix incorrectly formatted list strings.
    Useful if frontend sends a list as a string like: ["[\"A\", \"B\"]"]
    """
    # Override the method that converts incoming data (usually from JSON) into Python-native values.
    def to_internal_value(self, data):
        import json, ast

        # If the data is a list with one string item, like: ["['a', 'b']"]
        # Check if the data is a list with exactly one item and that item is a string
        if isinstance(data, list) and len(data) == 1 and isinstance(data[0], str):
            try:
                parsed = json.loads(data[0]) # Try JSON parsing
                if isinstance(parsed, list):
                    data = parsed
            # Example: data = ["[\"Monday\", \"Tuesday\"]"]  <- JSON format
            except:
                try:
                    """
                    ast.literal_eval():
                    It safely evaluates Python-style strings and turns them into Python objects.
                    # If JSON failed, try Python-style list parsing
                    # Example: data = ["['Monday', 'Tuesday']"] <- not valid JSON
                    """
                    parsed = ast.literal_eval(data[0])  # Try Python-style list parsing
                    if isinstance(parsed, list): 
                        data = parsed # Accept if it's a valid list
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
    # Nested serializer for attachments related to the service request (read-only)
    attachments = ServiceRequestAttachmentSerializer(many=True, read_only=True)

    # Show service_type using its "name" field instead of ID; allow name to be input
    # “This field refers to a service category. Use its name as the identifier, 
    # and only accept names that exist in the service category list.”
    service_type = serializers.SlugRelatedField(
        slug_field='name',  # Display and accept the 'name' of the ServiceCategory
        queryset=ServiceCategoryRepository.list_categories()  # Used to validate incoming data
    )

    # Custom list fields to handle flexible inputs; each item must be a string
    flexible_schedule_days = SafeListField(child=serializers.CharField(), required=False)
    flexible_time_slots = SafeListField(child=serializers.CharField(), required=False)
    preferred_qualifications = SafeListField(child=serializers.CharField(), required=False)

    class Meta:
        model = ServiceRequest  # Connect to the ServiceRequest model
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
        # Fields that are read-only and should not be updated via the API
        read_only_fields = [
            'id', 'created_at', 'status',
            'matched_provider_id', 'auto_expire_at'
        ]

    def validate(self, attrs):
        """
        Custom validation to ensure proper fields are provided based on schedule_type.
        If 'specific', preferred_date and preferred_time are required.
        If 'flexible', flexible_schedule_days and flexible_time_slots are required.
        """
        schedule_type = attrs.get('schedule_type')

        # Validation for 'specific' schedule type
        if schedule_type == 'specific':
            if not attrs.get('preferred_date') or not attrs.get('preferred_time'):
                raise serializers.ValidationError({
                    "preferred_date": "This field is required when schedule_type is 'specific'.",
                    "preferred_time": "This field is required when schedule_type is 'specific'."
                })

        # Validation for 'flexible' schedule type
        elif schedule_type == 'flexible':
            if not attrs.get('flexible_schedule_days') or not attrs.get('flexible_time_slots'):
                raise serializers.ValidationError({
                    "flexible_schedule_days": "This field is required when schedule_type is 'flexible'.",
                    "flexible_time_slots": "This field is required when schedule_type is 'flexible'."
                })

        return attrs  # Return validated data if all checks pass
