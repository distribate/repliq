import { getNatsConnection } from '@repo/config-nats/nats-client';
import { z } from 'zod';
import type { callServerCommandSchema } from '@repo/types/schemas/server/server-command.ts';

const subj = "call.server.command"

export async function publishServerCommand(payload: z.infer<typeof callServerCommandSchema>) {
  const connection = getNatsConnection();
  
  if (connection) {
    return connection.publish(subj, JSON.stringify(payload));
  } else {
    throw new Error("NATS connection not established");
  }
}