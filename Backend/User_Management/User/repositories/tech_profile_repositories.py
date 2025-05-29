from django.core.exceptions import ObjectDoesNotExist
from ..models import  TechnicalProfile,Custom_User,Service
from django.db.models import QuerySet 
from django.db import transaction
 

class TechProfileRepository: 
   
   def get_profile_by_user_id(self,user_id) -> TechnicalProfile:
        try:
            return TechnicalProfile.objects.get(user_id=user_id)
        except TechnicalProfile.DoesNotExist:
            raise ObjectDoesNotExist(f"TechnicalProfile not found for user_id {user_id}.")
    

   def update_profile(self, profile: TechnicalProfile, updated_data: dict) -> TechnicalProfile:
        for attr, value in updated_data.items():
            setattr(profile, attr, value)
        profile.save()
        return profile    
   
   def delete_user(self, profile: TechnicalProfile) -> None:
        profile.delete()

   def create_technical_profile_with_services(self,data):
    with transaction.atomic():
        # get the user
        user = Custom_User.objects.get(id=data.get("user_id"))

        # create technical profile
        technical_profile = TechnicalProfile.objects.create(
            user=user,
            category=data.get("category"),
            rate=data.get("rate", 0),
            work_state=data.get("work_state"),
        )

        # attach services
        service_ids = data.get("service_ids", [])  # expecting a list of service IDs
        services = Service.objects.filter(id__in=service_ids)
        technical_profile.service.set(services)

        return technical_profile    
    

   def update_technical_profile(self,profile: TechnicalProfile, updated_data: dict) -> TechnicalProfile:
    for attr, value in updated_data.items():
        if attr == "service_ids":
            services = Service.objects.filter(id__in=value)
            profile.service.set(services)
        else:
            setattr(profile, attr, value)
    profile.save()
    return profile 