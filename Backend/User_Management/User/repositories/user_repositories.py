from django.core.exceptions import ObjectDoesNotExist
from ..models import Custom_User ,Location,TechnicalProfile
from django.db.models import QuerySet
from ..utils.event_emitter import EventEmitter 
from django.db import transaction
 
class UserRepository:
    def __init__(self):
        self.event_emitter = EventEmitter()

    def create_user_with_location(self,data):
   #print(data.validated_data)
        with transaction.atomic():
            # create user
            user = Custom_User.objects.create(
                email=data.validated_data["email"],
                firstName = data.validated_data["firstName"],
                lastName = data.validated_data["lastName"],
                region =data.validated_data["region"],

                phone=data.validated_data["phone"],
                payment=data.validated_data["payment"],
                active=data.validated_data["active"],
                role='customer'
            )
       
            user.set_password(data.validated_data["password"])
            user.save()
            self.event_emitter.emit_user_created_event(user)
            # create location
 
            return user
        
    def get_user_by_email(self, user_email: str) -> Custom_User:
        try:
            return Custom_User.objects.get(email=user_email)
        except Custom_User.DoesNotExist:
            raise ObjectDoesNotExist("User not found.")   
        
    def get_all_users(self) -> QuerySet:
        return Custom_User.objects.all()

    def get_user_by_id(self, user_id) -> Custom_User:
            print(11111)
            return Custom_User.objects.get(id=user_id)
    
    def update_user(self, user: Custom_User, updated_data: dict) -> Custom_User:
        for attr, value in updated_data.items():
            setattr(user, attr, value)
        user.save()
        return user
    

    def delete_user(self, user: Custom_User) -> None:
        user.delete()

    def filter_users(self, **filters) -> QuerySet:
        return Custom_User.objects.filter(**filters)
    

    def create_service_provider_with_profile(self, data):
            with transaction.atomic():
                user = Custom_User.objects.create(
                    email=data.validated_data["email"],
                    firstName=data.validated_data["firstName"],
                    lastName=data.validated_data["lastName"],
                    phone=data.validated_data["phone"],
                    city=data.validated_data["city"],
                    region=data.validated_data["region"],
                    payment=data.validated_data["payment"],
                    active=data.validated_data["active"],
                    role='service_provider'
                )
                user.set_password(data.validated_data["password"])
                user.save()
                self.event_emitter.emit_user_created_event(user)

                # create technical profile
                TechnicalProfile.objects.create(
                    user=user,
                    serviceRegions=data.validated_data["serviceRegions"],
                    serviceCategories=data.validated_data["serviceCategories"],
                    employeeCount=data.validated_data["employeeCount"],
                    bio=data.validated_data["bio"],
                    availability=data.validated_data["availability"]
                )
                return user
