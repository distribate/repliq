import { getNatsConnection } from '@repo/config-nats/nats-client';
import { z } from 'zod';
import type { callServerCommandSchema } from '@repo/types/schemas/server/server-command.ts';
import { CALL_SERVER_COMMAND_SUBJECT } from '@repo/shared/constants/nats-subjects';

export function publishServerCommand(payload: z.infer<typeof callServerCommandSchema>) {
  const nc = getNatsConnection();

  return nc.publish(CALL_SERVER_COMMAND_SUBJECT, JSON.stringify(payload));
}