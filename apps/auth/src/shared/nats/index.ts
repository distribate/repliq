import { initNats } from "@repo/config-nats/nats-client"

export async function startNats() {
  await initNats()
}