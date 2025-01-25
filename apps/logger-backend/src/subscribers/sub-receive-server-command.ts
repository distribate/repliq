import { z } from "zod"
import { callServerCommandSchema } from "@repo/types/schemas/server/server-command"
import { getNatsConnection } from "@repo/config-nats/nats-client.ts"
import { callServerCommand } from "../utils/call-command"
import { CALL_SERVER_COMMAND_SUBJECT } from "@repo/shared/constants/nats-subjects";

export function subscribeReceiveServerCommand() {
  const nc = getNatsConnection()

  return nc.subscribe(CALL_SERVER_COMMAND_SUBJECT, {
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