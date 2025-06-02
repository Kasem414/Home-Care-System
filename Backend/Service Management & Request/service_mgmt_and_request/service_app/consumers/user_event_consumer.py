# import sys
# import django
# import os
# sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# # Setup Django manually if script is standalone
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "service_mgmt_and_request.settings")
# django.setup()
# from service_app.models import UserProfile
# from kombu import Connection, Exchange, Queue, Consumer
# import json
# from django.utils.timezone import now

# RABBITMQ_URL = "amqp://localhost"

# exchange = Exchange("user_events_exchange", type="direct")
# queue = Queue(name="user_events", exchange=exchange, routing_key="user.created")

# def handle_user_event(body, message):
#     print(f"Received event: {body}")
#     try:
#         data = json.loads(body) if isinstance(body, str) else body

#         user_id = int(data.get("id"))
#         defaults = {
#             "name": data.get("name"),
#             "phone": data.get("phone"),
#             "email": data.get("email"),
#             "role": data.get("role")
#         }

#         UserProfile.objects.update_or_create(id=user_id, defaults=defaults)
#         print(f"UserProfile synced: {user_id}")

#     except Exception as e:
#         print(f"Error processing event: {e}")
#     finally:
#         message.ack()

# def run_consumer():
#     with Connection(RABBITMQ_URL) as conn:
#         with Consumer(conn, queues=[queue], callbacks=[handle_user_event], accept=["json"]):
#             print("Listening for user events...")
#             while True:
#                 conn.drain_events()

# if __name__ == "__main__":
#     run_consumer()
import sys
import django
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# Setup Django manually if script is standalone
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "service_mgmt_and_request.settings")
django.setup()
from service_app.models import UserProfile
from kombu import Connection, Exchange, Queue, Consumer
import json
from django.utils.timezone import now

RABBITMQ_URL = "amqp://localhost"

exchange = Exchange("user_events_exchange", type="direct")
queue = Queue(name="user_events", exchange=exchange, routing_key="user.created")

def handle_user_event(body, message):
    print("🔥 Raw event received:", body)
    try:
        event = json.loads(body) if isinstance(body, str) else body
        print("📦 Parsed event:", event)

        user_data = event.get("data", {})
        print("👤 User data extracted:", user_data)

        user_id = int(user_data.get("id"))
        defaults = {
            "name": user_data.get("name"),
            "phone": user_data.get("phone"),
            "email": user_data.get("email"),
            "role": user_data.get("role")
        }

        from service_app.models import UserProfile
        user, created = UserProfile.objects.update_or_create(id=user_id, defaults=defaults)
        print("✅ Saved user:", user, " | Created:", created)

    except Exception as e:
        print("❌ Exception occurred:", e)

    finally:
        message.ack()

def run_consumer():
    with Connection(RABBITMQ_URL) as conn:
        with Consumer(conn, queues=[queue], callbacks=[handle_user_event], accept=["json"]):
            print("Listening for user events...")
            while True:
                conn.drain_events()

if __name__ == "__main__":
    run_consumer()