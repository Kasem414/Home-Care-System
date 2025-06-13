from not_app.models import Notification
from django.db.models import Q

class NotificationRepository:

    @staticmethod
    def create_notification(data):
        """
        Create a new notification with validated data (dict).
        """
        return Notification.objects.create(**data)


    @staticmethod
    def get_notifications_for_user(user_id, user_role):
        return Notification.objects.filter(user_id=user_id, user_role=user_role).order_by('-created_at')

    @staticmethod
    def get_by_id(notification_id):
        """
        Retrieve a notification by its ID.
        """
        try:
            return Notification.objects.get(id=notification_id)
        except Notification.DoesNotExist:
            return None

    @staticmethod
    def get_all_for_user(user_id, user_role=None, unread_only=False):
        """
        Get all notifications for a user (optionally filtered by unread only or user_role).
        """
        filters = Q(recipient_id=user_id)
        if user_role:
            filters &= Q(recipient_role=user_role)
        if unread_only:
            filters &= Q(is_read=False)

        return Notification.objects.filter(filters).order_by('-created_at')

    @staticmethod
    def mark_as_read(notification_id):
        """
        Mark a notification as read.
        """
        notification = NotificationRepository.get_by_id(notification_id)
        if notification:
            notification.is_read = True
            notification.save()
            return notification
        return None

    @staticmethod
    def delete_notification(notification_id):
        """
        Delete a notification by ID.
        """
        notification = NotificationRepository.get_by_id(notification_id)
        if notification:
            notification.delete()
            return True
        return False
        