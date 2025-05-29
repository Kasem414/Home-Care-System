from django.db import models
from django.contrib.auth import get_user_model

class Notification(models.Model):
    NOTIFICATION_STATE_CHOICES = (
        ('unread', 'Unread'),
        ('read', 'Read'),
    )

    NOTIFICATION_TYPE_CHOICES = (
        ('offer', 'Offer'),
        ('order', 'Order'),
        ('End Request', 'End Request'),
        ('Start Request', 'Start Request'),
    )
    
    id = models.AutoField(primary_key=True) 
    user = models.IntegerField()  # storing user ID directly for microservices architecture
    note = models.TextField()
    state = models.IntegerField(choices=NOTIFICATION_STATE_CHOICES, default=0)
    type = models.IntegerField(choices=NOTIFICATION_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
