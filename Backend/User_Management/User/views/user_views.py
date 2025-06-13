from rest_framework.views import APIView
from ..services.user_services import UserService
from ..services.tech_profile_services import TechProfileService
from ..repositories.user_repositories import UserRepository
from ..repositories.tech_profile_repositories import TechProfileRepository
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from ..models import Custom_User
from rest_framework.pagination import PageNumberPagination
from ..serializers.user_serializers  import UserSerializer, UserDetailSerializer
from rest_framework.permissions import AllowAny

class UserBaseView(APIView):
    permission_classes = [AllowAny]
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_service = UserService(UserRepository())
        self.tech_profile_service = TechProfileService(TechProfileRepository())

class CustomPagination(PageNumberPagination):
    page_size = 10   
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
          
        total_pages = (self.page.paginator.count + self.page_size - 1) // self.page_size
        
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': total_pages,   
            'results': data
        })

 
class ListUsersView(UserBaseView):
    print("test")
    pagination_class = CustomPagination
    def get(self, request):
        users = self.user_service.list_users()
        paginator = self.pagination_class()
        paginated_users = paginator.paginate_queryset(users, request)
        serialized = UserSerializer(paginated_users, many=True) 
        return paginator.get_paginated_response(UserSerializer(paginated_users, many=True).data)


 


class ListUsersNoPaginationView(UserBaseView):
    def get(self, request):
        users = self.user_service.list_users()
        serialized = UserSerializer(users, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)

class UpdateUserView(UserBaseView):
    def put(self, request, user_id):
        user = self.user_service.update_user(user_id, request.data)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class DeleteUserView(UserBaseView):
    def delete(self, request, user_id):
        self.user_service.delete_user(user_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

class SearchUserView(UserBaseView):
    def get(self, request, user_id):
        user = self.user_service.search_users(user_id)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class UpdateAccountView(UserBaseView):
    def put(self, request,user_id):
        print("in view")
        print(user_id)
        user = self.user_service.update_profile(user_id, request.data)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class DeleteAccountView(UserBaseView):
    def delete(self, request,user_id):
        self.user_service.delete_profile(user_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ActivateUserView(UserBaseView):
    def post(self, request, user_id):
        self.user_service.update_user(user_id, {"active": True})
        return Response({"status": "activated"}, status=status.HTTP_200_OK)

class DeactivateUserView(UserBaseView):
    def post(self, request, user_id):
        self.user_service.update_user(user_id, {"active": False})
        return Response({"status": "deactivated"}, status=status.HTTP_200_OK)

class UpdateWorkStateView(UserBaseView):
    def put(self, request, user_id):
        self.tech_profile_service.update_profile(user_id, {"work_state": request.data.get("work_state")})
        return Response({"status": "updated"}, status=status.HTTP_200_OK)

class UpdateTechProfileView(UserBaseView):
    def put(self, request, user_id):
        profile = self.tech_profile_service.update_profile(user_id, request.data)
        return Response({"status": "updated"}, status=status.HTTP_200_OK)

class GetMeView(UserBaseView):
    def get(self, request, user_id):
        user = self.user_service.search_users(user_id)
        return Response(UserDetailSerializer(user).data, status=status.HTTP_200_OK)

class GetMyPaymentStateView(UserBaseView):
    def get(self, request, user_id):
        user = self.user_service.search_users(user_id)
        return Response({"payment": user.payment}, status=status.HTTP_200_OK)



