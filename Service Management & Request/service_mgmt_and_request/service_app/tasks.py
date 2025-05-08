from celery import shared_task
import json
import logging
from .event_publisher import publish_event

logger = logging.getLogger(__name__)

@shared_task
def publish_service_category_event(event_type, category_id, name=None, description=None):
    """
    Publish event when service category is updated or deleted.
    This sends the event payload to RabbitMQ (via Celery).

    Args:
        event_type (str): 'updated' or 'deleted'
        category_id (str): UUID of the category
        name (str): Updated name (optional, for 'updated')
        description (str): Updated description (optional)
    """

    event = {
        "event_type": f"ServiceCategory{event_type.capitalize()}",
        "category_id": category_id,
    }
    if event_type == "created":
        event["name"] = name
        event["description"] = description
    if event_type == "updated":
        event["new_name"] = name
        event["description"] = description
    elif event_type == "deleted":
        event["deleted_name"] = name
    # Simulating publishing by logging it (or optionally send to exchange later)
    logger.info(f"Publishing Event to RabbitMQ: {json.dumps(event)}")
    # Publish to real RabbitMQ queue now
    publish_event(payload=event,routing_key="service_category")
    return event
# @shared_task
# def simple_test_task():
#     print("Simple Celery task executed successfully!")
#     return "Task Completed"

