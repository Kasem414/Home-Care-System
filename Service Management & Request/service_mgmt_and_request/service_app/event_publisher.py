from kombu import Connection, Exchange, Queue, Producer
import json

# RabbitMQ URL
RABBITMQ_URL = "amqp://localhost"  # Or from settings

# Define exchange (optional, for fanout/broadcast)
exchange = Exchange("service_events_exchange", type="direct")

# Define queue name (can be same across services)
queue_name = "service_events"

def publish_event(payload: dict, routing_key: str):
    """
    Publishes an event payload to the RabbitMQ queue.
    """
    with Connection(RABBITMQ_URL) as conn:
        channel = conn.channel()
        queue = Queue(name=queue_name, exchange=exchange, routing_key=routing_key)
        queue.maybe_bind(conn)
        queue.declare()

        producer = Producer(channel, exchange=exchange, routing_key=routing_key)
        producer.publish(
            json.dumps(payload),
            serializer='json',
            content_type='application/json',
            content_encoding='utf-8'
        )

        print(f"Published to RabbitMQ: {payload}")