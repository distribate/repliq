import { getNatsConnection } from "@repo/config-nats/nats-client"

const subj = `forum.user.*.notifications`

export const subNotifications = async () => {
  const nc = getNatsConnection()

  return nc.subscribe(subj, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(msg.json())
    }
  })
}