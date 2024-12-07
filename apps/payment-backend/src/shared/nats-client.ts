import { connect, type NatsConnection } from '@nats-io/transport-node';

const nc: NatsConnection = await connect({ servers: 'nats://localhost:4222' });
console.log("NATS started")

export async function stopNatsClient() {
  try {
    console.log("Closing NATS connection...");
    await nc.drain();
    console.log("NATS connection closed.");
  } catch (err) {
    console.error("Error closing NATS connection:", err);
  }
}

export { nc };