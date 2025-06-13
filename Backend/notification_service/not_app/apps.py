from django.apps import AppConfig


class NotAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'not_app'
