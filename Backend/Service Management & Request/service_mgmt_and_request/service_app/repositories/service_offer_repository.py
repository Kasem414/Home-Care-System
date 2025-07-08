from service_app.models import ServiceOffer
from django.utils import timezone
from django.db.models import Q

class ServiceOfferRepository:

    @staticmethod
    def create_offer(data):
        return ServiceOffer.objects.create(**data)

    @staticmethod
    def get_by_id(offer_id):
        return ServiceOffer.objects.filter(id=offer_id).first()

    @staticmethod
    def get_all():
        return ServiceOffer.objects.all()

    @staticmethod
    def get_by_status(status=None):
        if status:
            return ServiceOffer.objects.filter(status=status)
        return ServiceOffer.objects.all()

    @staticmethod
    def get_by_provider(provider_id, status=None):
        queryset = ServiceOffer.objects.filter(provider_id=provider_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @staticmethod
    def update_offer(offer_id, update_data):
        offer = ServiceOfferRepository.get_by_id(offer_id)
        if offer:
            for key, value in update_data.items():
                setattr(offer, key, value)
            offer.save()
            return offer
        return None

    @staticmethod
    def delete_offer(offer_id):
        offer = ServiceOfferRepository.get_by_id(offer_id)
        if offer:
            offer.delete()
            return True
        return False

    @staticmethod
    def get_active_offers():  # Optional: skip expired offers
        return ServiceOffer.objects.filter(
            Q(auto_expire_at__gt=timezone.now()) &
            Q(status="pending")
        )
    @staticmethod
    def get_offer_by_request(request_id):
        return  ServiceOffer.objects.filter(request_id=request_id)
