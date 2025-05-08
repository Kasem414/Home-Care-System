from ..models import ServiceRequest, ServiceRequestAttachment
from django.db import IntegrityError

class ServiceRequestRepository:
    
    @staticmethod
    def create_service_request(data):
        try:
            return ServiceRequest.objects.create(**data)
        except IntegrityError as e:
            raise Exception(f"Failed to create service request: {e}")
    
    @staticmethod
    def get_by_id(request_id):
        return ServiceRequest.objects.filter(id=request_id).first()
    
    @staticmethod
    def get_all():
        return ServiceRequest.objects.all()
    
    @staticmethod
    def update_request(request_id, update_data):
        obj = ServiceRequestRepository.get_by_id(request_id)
        if obj:
            for key, value in update_data.items():
                setattr(obj, key, value)
            obj.save()
            return obj
        return None

    @staticmethod
    def delete_request(request_id):
        obj = ServiceRequestRepository.get_by_id(request_id)
        if obj:
            obj.delete()
            return True
        return False


class ServiceRequestAttachmentRepository:

    @staticmethod
    def create_attachment(request_instance, image_file):
        return ServiceRequestAttachment.objects.create(request=request_instance, image=image_file)

    @staticmethod
    def get_attachments_for_request(request_id):
        return ServiceRequestAttachment.objects.filter(request_id=request_id)
    @staticmethod
    def delete_attachment_by_id(attachment_id):
        return ServiceRequestAttachment.objects.filter(id=attachment_id).delete()

    @staticmethod
    def clear_attachments_for_request(request_id):
        return ServiceRequestAttachment.objects.filter(request_id=request_id).delete()

    @staticmethod
    def update_attachments(request_instance, new_images):
        # This function replaces all old attachments with new ones
        ServiceRequestAttachmentRepository.clear_attachments_for_request(request_instance.id)
        return [
            ServiceRequestAttachmentRepository.create_attachment(request_instance, image)
            for image in new_images
        ]