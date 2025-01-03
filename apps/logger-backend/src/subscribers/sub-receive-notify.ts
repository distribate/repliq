import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Notifications } from "@repo/types/db/forum-database-types";
import { Selectable } from "kysely";

const subj = "forum.user.*.notifications"

export const subscribeReceiveNotify = () => {
  const nc = getNatsConnection()

  return nc.subscribe(subj, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message: Selectable<Notifications> = msg.json()

      if (message) {
        try {
   
        } catch (error) {
          console.error("Error sending issue logs: ", error);
        }
      }
    }
  })
}