from .models import Notification

class NotificationRepository:
    @staticmethod
    def get_notifications_by_user(user):
        return Notification.objects.filter(user=user).order_by('-created_at')

    @staticmethod
    def create_notification(user, note, note_type):
        return Notification.objects.create(user=user, note=note, type=note_type)

    @staticmethod
    def change_notification_state(note_id, state):
        note = Notification.objects.filter(id=note_id).first()
        if note:
            note.state = state
            note.save()
        return note

    @staticmethod
    def get_user_note_by_id(user, note_id):
        return Notification.objects.filter(user=user, id=note_id).first()