from rest_framework import serializers
from service_app.models import ServiceCategory

class ServiceCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for ServiceCategory model.
    Handles validation and serialization/deserialization of ServiceCategory instances.
    """

    class Meta:
        model = ServiceCategory
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_name(self, value):
        """
        Validate that the service category name is unique.
        (Django DB already enforces unique=True, but we add extra validation at serializer level too.)
        """
        if self.instance:  # If updating, exclude current instance from uniqueness check
            if ServiceCategory.objects.filter(name=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A service category with this name already exists.")
        else:  # If creating new
            if ServiceCategory.objects.filter(name=value).exists():
                raise serializers.ValidationError("A service category with this name already exists.")
        return value