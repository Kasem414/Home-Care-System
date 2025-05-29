import json
import pika

class EventEmitter:
    def __init__(self): 
        self.connection = pika.BlockingConnection(pika.ConnectionParameters('127.0.0.1'))
        self.channel = self.connection.channel()
 
        self.channel.exchange_declare(exchange='user_events', exchange_type='fanout')

    def emit_user_created_event(self, user):
        event_data = {
            "event_type": "user_created",
            "data": {
                "id": user.id,
                "name": user.firstName 
            }
        }

        self.channel.basic_publish(
            exchange='user_events',
            routing_key='',   
            body=json.dumps(event_data)
        )
        print(f"Emitted 'user_created' event: {event_data}")

    def __del__(self):
        if hasattr(self, 'connection'):
            self.connection.close()

