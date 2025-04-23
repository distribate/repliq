import { connect, type NatsConnection, type ConnectionOptions } from "@nats-io/transport-node";
// @ts-ignore
const token = process.env.NATS_AUTH_TOKEN!
// @ts-ignore
const host = process.env.NATS_HOST! ?? "localhost:4222"

const NATS_CONFIG: ConnectionOptions = {
  servers: `nats://${host}`,
  token,
  reconnect: true,           
  maxReconnectAttempts: -1,  
  reconnectTimeWait: 2000, 
}

let nc: NatsConnection | null = null;

export async function initNats() {
  try {
    nc = await connect(NATS_CONFIG);
    console.log("\x1b[34m[NATS]\x1b[0m Connected to", NATS_CONFIG.servers);
  } catch (err) {
    console.error('\x1b[34m[NATS]\x1b[0m Failed to connect to NATS:', err);
    throw new Error('\x1b[34m[NATS]\x1b[0m NATS connection failed');
  }
}

export function getNatsConnection(): NatsConnection {
  if (!nc) {
    throw new Error('\x1b[34m[NATS]\x1b[0m NATS client is not initialized');
  }
  
  return nc;
}

export async function closeNatsConnection() {
  if (!nc) return;

  try {
    console.log('\x1b[34m[NATS]\x1b[0m Closing NATS connection...');
    await nc.drain();
    console.log('\x1b[34m[NATS]\x1b[0m NATS connection closed.');
  } catch (err) {
    console.error('\x1b[34m[NATS]\x1b[0m Error closing NATS connection:', err);
  }
}