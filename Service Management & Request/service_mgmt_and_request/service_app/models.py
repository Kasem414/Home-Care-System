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
        max_length=255,
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

class ServiceRequest(models.Model):
    # Auto-incrementing primary key
    id = models.AutoField(primary_key=True)

    customer_id = models.IntegerField()  # Provided in header (X-User-Id)
    category = models.ForeignKey(ServiceCategory,on_delete=models.CASCADE,related_name='requests')  # Foreign key to ServiceCategory (assumed integer)

    description = models.TextField()
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    additionalInfo = models.TextField(blank=True, null=True)

    preferredDate = models.DateField(blank=True, null=True)
    preferredTime = models.TimeField(blank=True, null=True)

    flexibleDays = models.JSONField(blank=True, null=True)
    flexibleTimes = models.JSONField(blank=True, null=True)

    budget_min_hourly = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    budget_max_hourly = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fixed_price_offer = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    status = models.CharField(max_length=50, default="Pending")
    matched_provider_id = models.IntegerField(blank=True, null=True)

    auto_expire_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    preferredQualifications = models.CharField(max_length=50,blank=True,null=True)
    def str(self):
        return f"ServiceRequest #{self.id} - Category: {self.category_id}"


class ServiceRequestAttachment(models.Model):
    id = models.AutoField(primary_key=True)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='attachments')
    image = models.ImageField(upload_to='service_request_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"Attachment #{self.id} for Request #{self.request.id}"