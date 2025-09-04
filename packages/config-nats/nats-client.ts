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
    console.log(`\x1B[35m[NATS]\x1B[0m Connected to ${NATS_CONFIG.servers}`);
  } catch (e) {
    console.error('\x1B[35m[NATS]\x1B[0m Failed to connect', e);
    exit(1)
  }
}

export function getNatsConnection(): NatsConnection {
  if (!nc) {
    throw new Error('\x1B[35m[NATS]\x1B[0m Client is not initialized');
  }
  
  return nc;
}

export async function closeNatsConnection() {
  if (!nc) return;

  try {
    console.log('\x1B[35m[NATS]\x1B[0m Closing connection...');
    await nc.drain();
    console.log('\x1B[35m[NATS]\x1B[0m Connection closed.');
  } catch (e) {
    console.error('\x1B[35m[NATS]\x1B[0m Closing connection:', e);
    exit(1)
  }
}