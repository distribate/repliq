import { z } from "zod"
import { callServerCommandSchema } from "@repo/types/schemas/server/server-command"
import { getNatsConnection } from "@repo/config-nats/nats-client.ts"
import { callServerCommand } from "../utils/call-command"

const subj = "call.server.command"

export async function subReceiveServerCommand() {
  const nc = getNatsConnection()

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