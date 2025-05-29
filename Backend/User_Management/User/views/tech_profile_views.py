from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from User.serializers.tech_profile_serializers import CreateTechnicalProfileSerializer, UpdateTechnicalProfileSerializer
from ..repositories.tech_profile_repositories import TechProfileRepository
from ..services.tech_profile_services import TechProfileService
from django.core.exceptions import ObjectDoesNotExist



class BaseTechnicalProfileView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)  
        self.TechProfileService = TechProfileService(TechProfileRepository())

class CreateTechnicalProfileView(BaseTechnicalProfileView):
    def post(self, request):
        serializer = CreateTechnicalProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = self.TechProfileService.create_profile(serializer.validated_data)
            return Response({"message": "Technical profile created successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

 

class UpdateTechnicalProfileView(BaseTechnicalProfileView):
    def put(self, request, user_id):
        try:
            profile = self.TechProfileService.update_profile(user_id, request.data)
            return Response({"message": "Technical profile updated successfully."})
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteTechnicalProfileView(BaseTechnicalProfileView):
    def delete(self, request, user_id):
        try:
            self.TechProfileService.delete_profile(user_id)
            return Response({"message": "Technical profile deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
