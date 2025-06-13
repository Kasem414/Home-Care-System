from rest_framework import serializers
from not_app.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'user_id',
            'user_role',
            'title',
            'message',
            'notification_type',
            'related_object_id',
            'extra_data',
            'is_read',
            'createdAt',
        ]
        read_only_fields = ['id', 'createdAt']