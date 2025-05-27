import { connect, type NatsConnection, type ConnectionOptions } from "@nats-io/transport-node";
import { logger } from "@repo/lib/utils/logger.ts"

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

const natsLogger = logger.child("NATS")

export async function initNats() {
  try {
    nc = await connect(NATS_CONFIG);
    natsLogger.success(`Connected to ${NATS_CONFIG.servers}`);
  } catch (err) {
    natsLogger.error('Failed to connect to NATS:', err);
    throw new Error('NATS connection failed');
  }
}

export function getNatsConnection(): NatsConnection {
  if (!nc) {
    throw new Error('NATS client is not initialized');
  }
  
  return nc;
}

export async function closeNatsConnection() {
  if (!nc) return;

  try {
    natsLogger.info('Closing NATS connection...');
    await nc.drain();
    natsLogger.success('NATS connection closed.');
  } catch (err) {
    natsLogger.error('Error closing NATS connection:', err);
  }
}