import { connect } from '@nats-io/transport-node';
import type { NatsConnection } from '@nats-io/transport-node';
import { z } from 'zod';
import type { callServerCommandSchema } from '@repo/types/schemas/server/server-command.ts';

const subj = "call.server.command"

let nc: NatsConnection | null = null;

export async function startNATS() {
  if (!nc) {
    nc = await connect({ servers: 'nats://localhost:4222' });
    console.log('\x1b[34mNATS started\x1b[0m');
  }
  
  return nc;
}

export function getNATSConnection(): NatsConnection | null {
  return nc;
}

export async function publishServerCommand(payload: z.infer<typeof callServerCommandSchema>) {
  const connection = getNATSConnection();
  
  if (connection) {
    return connection.publish(subj, JSON.stringify(payload));
  } else {
    throw new Error("NATS connection not established");
  }
}