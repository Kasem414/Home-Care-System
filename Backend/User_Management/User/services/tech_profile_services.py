from django.core.exceptions import ObjectDoesNotExist
from ..repositories.tech_profile_repositories import TechProfileRepository
from ..models import TechnicalProfile

class TechProfileService:
    def __init__(self, tech_profile_services: TechProfileRepository):
        self.tech_profile_services = tech_profile_services
 
    def create_profile(self,data: dict) -> TechnicalProfile:
        return self.tech_profile_services.create_technical_profile_with_services(data)
      
    def update_profile(self,user_id: int, updated_data: dict) -> TechnicalProfile:
        profile = self.tech_profile_services.get_profile_by_user_id(user_id)
        return TechProfileRepository.update_technical_profile(self,profile, updated_data)
     
    def delete_profile(self,user_id: int) -> None:
        profile = self.tech_profile_services.get_profile_by_user_id(user_id)
        self.tech_profile_services.delete_user(profile)
