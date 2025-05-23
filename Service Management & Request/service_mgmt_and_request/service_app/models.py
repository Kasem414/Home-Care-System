from django.db import models
from django.utils import timezone
from datetime import timedelta

class ServiceCategory(models.Model):
    """
    Model representing a global service category (e.g., Plumbing, Electrical).
    Managed only by Admin users.
    """
    id = models.AutoField(
        primary_key=True
    )
    name = models.CharField(
        max_length=100,
        unique=True,  # Enforce uniqueness at the DB level
    )
    description = models.TextField(
        blank=True,)
    created_by_user_id = models.IntegerField()
    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"
        ordering = ['name']

    def __str__(self):
        """
        String representation of the service category (used in Django Admin and shell).
        """
        return self.name


class ServiceRequest(models.Model):
    id = models.AutoField(primary_key=True)

    # Basic Info
    customer_id = models.IntegerField()
    service_type = models.ForeignKey(ServiceCategory, to_field='name', db_column='service_type', on_delete=models.CASCADE)
    description = models.TextField()
    is_urgent = models.BooleanField(default=False)

    # Location
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    additional_info = models.TextField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Schedule
    preferred_date = models.DateField(blank=True, null=True)
    preferred_time = models.TimeField(blank=True, null=True)
    schedule_type = models.CharField(
        max_length=20,
        choices=[('specific', 'Specific'), ('flexible', 'Flexible')],
        default='specific'
    )
    flexible_schedule_days = models.JSONField(blank=True, null=True)
    flexible_time_slots = models.JSONField(blank=True, null=True)

    # Budget
    budget_type = models.CharField(max_length=20, choices=[('hourly', 'Hourly'), ('fixed', 'Fixed')])
    budget_min_hourly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max_hourly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fixed_price_offer = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Additional Fields
    preferred_qualifications = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=50, default='submitted')
    matched_provider_id = models.IntegerField(null=True, blank=True)
    auto_expire_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request #{self.id} - {self.description[:30]}"

class ServiceRequestAttachment(models.Model):
    id = models.AutoField(primary_key=True)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='attachments')
    image = models.ImageField(upload_to='service_request_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment #{self.id} for Request #{self.request.id}"

class ServiceOffer(models.Model):
    id = models.AutoField(primary_key=True)

    request = models.ForeignKey('ServiceRequest', on_delete=models.CASCADE, related_name='offers')
    provider_id = models.IntegerField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_date = models.DateField()
    available_time = models.TimeField()
    estimated_duration = models.DecimalField(max_digits=4, decimal_places=2) 

    materials = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    auto_expire_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.auto_expire_at:
            self.auto_expire_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Offer by Provider {self.provider_id} for Request {self.request.id}"

class UserProfile(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    role = models.CharField(max_length=50)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.name} ({self.role})"