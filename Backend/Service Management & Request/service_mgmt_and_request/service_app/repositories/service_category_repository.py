from service_app.models import ServiceCategory
from django.db import IntegrityError

class ServiceCategoryRepository:
    """
    Repository class to handle database operations for ServiceCategory.
    """

    @staticmethod
    def create_category(name, description):
        """
        Create a new service category.
        
        Args:
            name (str): Name of the category.
            description (str): Optional description.

        Returns:
            ServiceCategory instance if created successfully, None if failed.
        Raises:
            IntegrityError: If category creation violates DB constraints.
        """
        try:
            category = ServiceCategory.objects.create(
                name=name,
                description=description
            )
            return category
        except IntegrityError as e:
            raise e

    @staticmethod
    def list_categories():
        """
        Retrieve all service categories, ordered by name.

        Returns:
            QuerySet of ServiceCategory instances.
        """
        return ServiceCategory.objects.all()

    @staticmethod
    def get_category_by_id(category_id):
        """
        Retrieve a single service category by ID.

        Args:
            category_id (UUID): ID of the category.

        Returns:
            ServiceCategory instance if found, None otherwise.
        """
        try:
            return ServiceCategory.objects.get(id=category_id)
        except ServiceCategory.DoesNotExist:
            return None

    @staticmethod
    def update_category(category, name=None, description=None):
        """
        Update an existing service category.

        Args:
            category (ServiceCategory): The category object to update.
            name (str, optional): New name.
            description (str, optional): New description.

        Returns:
            ServiceCategory: Updated category instance.
        """
        if name:
            category.name = name
        if description:
            category.description = description
        category.save()
        return category

    @staticmethod
    def delete_category(category):
        """
        Delete a service category.

        Args:
            category (ServiceCategory): The category instance to delete.
        """
        category.delete()