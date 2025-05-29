 
from ..repositories.user_repositories import UserRepository
from rest_framework.exceptions import NotFound
from ..models  import Custom_User


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def list_users(self):
        return self.user_repo.get_all_users()    
    
    def update_user(self, user_id, validated_data):
        try:
            user = self.user_repo.get_user_by_id(user_id)
        except Custom_User.DoesNotExist:
            raise NotFound("User not found")
        return self.user_repo.update_user(user, validated_data)
    
    
    def delete_user(self, user_id):
        try:
            user = self.user_repo.get_user_by_id(user_id)
        except Custom_User.DoesNotExist:
            raise NotFound("User not found")
        self.user_repo.delete_user(user)

    def search_users(self, user_id):
        try:
            user = self.user_repo.get_user_by_id(user_id)
        except Custom_User.DoesNotExist:
            raise NotFound("User not found")
        return user

    def update_profile(self, user_id, validated_data):
        try:
            user = self.user_repo.get_user_by_id(user_id)
            print("test")
            print(user)
        except Custom_User.DoesNotExist:
            raise NotFound("User not found")
        return self.user_repo.update_user(user, validated_data)

    def delete_profile(self, user_id):
        try:
            user = self.user_repo.get_user_by_id(user_id)
        except Custom_User.DoesNotExist:
            raise NotFound("User not found")
        self.user_repo.delete_user(user)
    