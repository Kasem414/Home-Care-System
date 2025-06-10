# import json
# import pika

# class EventEmitter:
#     def __init__(self): 
#         self.connection = pika.BlockingConnection(pika.ConnectionParameters('127.0.0.1'))
#         self.channel = self.connection.channel()
 
#         self.channel.exchange_declare(exchange='user_events', exchange_type='direct')

#     def emit_user_created_event(self, user):
#         event_data = {
#             "event_type": "user_created",
#             "data": {
#                 "id": user.id,
#                 "name": user.firstName 
#             }
#         }

#         self.channel.basic_publish(
#             exchange='user_events',
#             routing_key='',   
#             body=json.dumps(event_data)
#         )
#         print(f"Emitted 'user_created' event: {event_data}")

#     def __del__(self):
#         if hasattr(self, 'connection'):
#             self.connection.close()

# user/utils/event_emitter.py
import json
import pika

class EventEmitter:
    def __init__(self): 
        self.connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        self.channel = self.connection.channel()

        # ✅ Use 'direct' exchange to allow routing by event type
        self.channel.exchange_declare(exchange='user_events', exchange_type='direct')

    def emit_user_created_event(self, user):
        event_data = {
            "event_type": "user_created",
            "data": {
                "id": user.id,
                "name": user.firstName,
                "phone": user.phone,
                "email": user.email,
                "role": user.role,
                "city": user.city,
                "region": user.region
            }
        }

        self.channel.basic_publish(
            exchange='user_events',
            routing_key='user.created',  # 🔁 Routing key used by consumers
            body=json.dumps(event_data)
        )
        print(f"✅ Emitted 'user_created' event: {event_data}")

    def __del__(self):
        if hasattr(self, 'connection'):
            self.connection.close()