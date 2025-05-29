from django.urls import path
from .views import MyNotificationsView, SendNotificationView, NotificationsByUserView, ChangeNotificationStateView

urlpatterns = [
    path('my/', MyNotificationsView.as_view(), name='my-notifications'),
    path('send/', SendNotificationView.as_view(), name='send-notification'),
    path('user/<int:user_id>/', NotificationsByUserView.as_view(), name='notifications-by-user'),
    path('<int:note_id>/state/', ChangeNotificationStateView.as_view(), name='change-notification-state'),
]

