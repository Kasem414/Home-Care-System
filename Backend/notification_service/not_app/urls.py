from django.urls import path
from not_app.views.notification_view_create_list import NotificationCreateView, NotificationListView
from not_app.views.notification_view_mark import MarkNotificationAsReadView
from not_app.views.notification_view_delete import NotificationDeleteView
urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/create/', NotificationCreateView.as_view(), name='notification-create'),
    path('notifications/<int:notification_id>/read/', MarkNotificationAsReadView.as_view(), name='notification-mark-read'),
    # path('notifications/mark-read-bulk/', BulkMarkAsReadView.as_view(),name='notifications-list-mark-read'),
    path('notifications/<int:pk>/', NotificationDeleteView.as_view(),name='notification-delete'),
]
