from django.db import models
from django.contrib.auth.hashers import make_password
from django.db.models import JSONField  
class Custom_User(models.Model):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('service_provider', 'Service Provider'), 
        ('administrator', 'Administrator')  
    )
    
    id = models.AutoField(primary_key=True) 
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    city= models.CharField(max_length=255)
    region= models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    active = models.BooleanField(default=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def __str__(self):
        return self.email
    class Meta:
        db_table = 'customuser'

class Location(models.Model):
    user = models.ForeignKey(Custom_User, on_delete=models.CASCADE, related_name='locations')
    lat = models.FloatField()  # Latitude
    lag = models.FloatField()  # Longitude

    def __str__(self):
        return f"Location for {self.user.email} ({self.lat}, {self.lag})"
    class Meta:
        db_table = 'Location'

class Service(models.Model):
    type = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.type} - {self.category}"
    class Meta:
        db_table = 'Service'
        
class TechnicalProfile(models.Model):
    user = models.OneToOneField(Custom_User, on_delete=models.CASCADE, related_name='technical_profile')
    serviceCategories =   JSONField(default=list, blank=True)
    serviceRegions = JSONField(default=list, blank=True)
    employeeCount= models.CharField(max_length=255)
    bio=models.CharField(max_length=255)
    availability= JSONField(default=list, blank=True)
    yearsInBusiness=models.CharField(max_length=255)
### avalable / not avalable / in work / 

###fr
    service = models.ManyToManyField(Service, related_name='technical_profiles')

    def __str__(self):
        return f"Technical Profile for {self.user.email}"
    class Meta:
        db_table = 'TechnicalProfile'    