from .repositories import NotificationRepository
from .models import Notification

class NotificationService:
    @staticmethod
    def get_my_notifications(user):
        return NotificationRepository.get_notifications_by_user(user)

    @staticmethod
    def send_notification(user, note, note_type):
        return NotificationRepository.create_notification(user, note, note_type)

    @staticmethod
    def get_notifications_by_user(user):
        return NotificationRepository.get_notifications_by_user(user)

    @staticmethod
    def change_notification_state(user, note_id, new_state):
        note = NotificationRepository.get_user_note_by_id(user, note_id)
        if note:
            return NotificationRepository.change_notification_state(note_id, new_state)
        return None
