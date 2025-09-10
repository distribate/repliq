import { updateUserActivityStatus } from "#lib/modules/user-activity-status.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_ACTIVITY_STATUS_SUBJECT } from "@repo/shared/constants/nats-subjects";

export const subscribeUserStatus = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_ACTIVITY_STATUS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err)
        return
      }

      const nickname = new TextDecoder().decode(msg.data)
    
      updateUserActivityStatus(nickname)
    }
  })
}