import { updateUserStatusInKv } from "#utils/update-user-status-in-kv.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_STATUS_SUBJECT } from "@repo/shared/constants/nats-subjects";

export const subscribeUserStatus = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_STATUS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err)
        return
      }

      const nickname = JSON.parse(new TextDecoder().decode(msg.data))

      await updateUserStatusInKv(nickname)
    }
  })
}