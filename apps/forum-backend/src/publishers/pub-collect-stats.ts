import { getNatsConnection } from "@repo/config-nats/nats-client"

export type StatsPayload = {
  ip: string | null,
  initiator: string | null
}

export const COLLECT_STATS_SUBJECT = "collect-stats"

export function publishStats({ ip, initiator }: StatsPayload) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    ip, initiator
  })

  return nc.publish(COLLECT_STATS_SUBJECT, payload)
}