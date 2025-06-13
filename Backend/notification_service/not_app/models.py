from django.db import models

class Notification(models.Model):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('provider', 'Provider'),
    ]

    TYPE_CHOICES = [
        ('request_created', 'Request Created'),
        ('offer_accepted', 'Offer Accepted'),
        ('offer_rejected', 'Offer Rejected'),
        ('offer_submitted', 'New Offer Submitted'),
        ('category_created', 'New Service Category Created'),
    ]

    user_id = models.IntegerField()
    user_role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    related_object_id = models.IntegerField(null=True, blank=True)
    extra_data = models.JSONField(null=True, blank=True)  # ✅ newly added field
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_role.capitalize()} Notification: {self.title}"