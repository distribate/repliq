import { connect, type NatsConnection, type ConnectionOptions } from "@nats-io/transport-node";

const NATS_CONFIG: ConnectionOptions = {
  servers: "nats://localhost:4222",
  token: process.env.NATS_AUTH_TOKEN!,
  reconnect: true,            // Включить автоматическое переподключение
  maxReconnectAttempts: -1,   // Неограниченное количество попыток
  reconnectTimeWait: 2000,    // Задержка между попытками переподключения
}

let nc: NatsConnection | null = null;

export async function initNats() {
  try {
    nc = await connect(NATS_CONFIG);
    console.log("\x1b[34m[NATS]\x1b[0m Connected to", NATS_CONFIG.servers);
  } catch (err) {
    console.error('Failed to connect to NATS:', err);
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
  if (nc) {
    try {
      console.log('Closing NATS connection...');
      await nc.drain();
      console.log('NATS connection closed.');
    } catch (err) {
      console.error('Error closing NATS connection:', err);
    }
  }
}