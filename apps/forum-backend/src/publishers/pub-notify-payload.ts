import { getNatsConnection } from "@repo/config-nats/nats-client"
import type { Notifications } from "@repo/types/db/forum-database-types"
import type { Selectable } from "kysely"

export const publishNotifyPayload = async (payload: Selectable<Notifications>) => {
  const nc = getNatsConnection()

  return nc.publish("forum.user.distribate.notifications", JSON.stringify(payload))
}