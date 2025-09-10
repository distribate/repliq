import { getNatsConnection } from "@repo/config-nats/nats-client"
import { COLLECT_STATS_SUBJECT } from "@repo/shared/constants/nats-subjects"

export type StatsPayload = {
  ip: string | null,
  initiator: string | null
}

export function publishStats({ ip, initiator }: StatsPayload) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    ip, initiator
  })

  return nc.publish(COLLECT_STATS_SUBJECT, payload)
}