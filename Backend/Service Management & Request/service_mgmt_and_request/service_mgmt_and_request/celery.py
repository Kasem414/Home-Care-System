import os 
from celery import Celery

# Set default Django settings module

os.environ.setdefault('DJANGO_SETTINGS_MODULE','service_mgmt_and_request.settings')

# Create Celery app
app = Celery('service_mgmt_and_request')

# Load settings from Django settings.py (CELERY settings preefix)
app.config_from_object('django.conf:settings',namespace='CELERY')

# Discover tasks in all apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')