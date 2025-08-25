import { connect, type NatsConnection, type ConnectionOptions } from "@nats-io/transport-node";
import { exit } from 'node:process';

// @ts-ignore
const token = process.env.NATS_AUTH_TOKEN!
// @ts-ignore
const host = process.env.NATS_HOST! ?? "127.0.0.1:4222"

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
    console.log(`Connected to ${NATS_CONFIG.servers}`);
  } catch (e) {
    console.error('Failed to connect to NATS:', e);
    exit(1)
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
    console.log('Closing NATS connection...');
    await nc.drain();
    console.log('NATS connection closed.');
  } catch (e) {
    console.error('Error closing NATS connection:', e);
    exit(1)
  }
}