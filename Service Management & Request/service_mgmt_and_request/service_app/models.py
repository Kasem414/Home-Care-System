from django.db import models

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

    def str(self):
        """
        String representation of the service category (used in Django Admin and shell).
        """
        return self.name

class Location(models.Model):
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    additional_info = models.TextField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)


class Schedule(models.Model):
    preferred_date = models.DateField(blank=True, null=True)
    preferred_time = models.TimeField(blank=True, null=True)
    schedule_type = models.CharField(max_length=20, choices=[('specific', 'Specific'), ('flexible', 'Flexible')])
    flexible_schedule_days = models.JSONField(blank=True, null=True)
    flexible_time_slots = models.JSONField(blank=True, null=True)


class Budget(models.Model):
    budget_type = models.CharField(max_length=20, choices=[('hourly', 'Hourly'), ('fixed', 'Fixed')])
    budget_min_hourly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max_hourly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fixed_price_offer = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)


class ServiceRequest(models.Model):
    customer_id = models.IntegerField()
    service_type = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    description = models.TextField()
    is_urgent = models.BooleanField(default=False)

    location = models.OneToOneField(Location, on_delete=models.CASCADE)
    schedule = models.OneToOneField(Schedule, on_delete=models.CASCADE)
    budget = models.OneToOneField(Budget, on_delete=models.CASCADE)
    preferred_qualifications = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=50, default='submitted')
    matched_provider_id = models.IntegerField(null=True, blank=True)
    auto_expire_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"Request #{self.id} - {self.description[:30]}"

class ServiceRequestAttachment(models.Model):
    id = models.AutoField(primary_key=True)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='attachments')
    image = models.ImageField(upload_to='service_request_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"Attachment #{self.id} for Request #{self.request.id}"