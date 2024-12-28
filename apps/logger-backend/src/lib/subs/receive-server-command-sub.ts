import type { NatsConnection } from "@nats-io/transport-node"
import { z } from "zod"
import { callServerCommandSchema } from "@repo/types/schemas/server/server-command"
import { callServerCommand } from "../../lib/rcon-server/call-command.ts"

const subj = "call.server.command"

export async function receiveServerCommandSub(nc: NatsConnection) {
  return nc.subscribe(subj, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const payload: z.infer<typeof callServerCommandSchema> = msg.json()
      
      if (payload) {
        try {
          await callServerCommand(payload)
        } catch (error) {
          console.error("Error sending notify: ", error);
        }
      }
    }
  })
}