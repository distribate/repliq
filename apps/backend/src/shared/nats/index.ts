import { initNats } from "@repo/config-nats/nats-client"
import { SUBSCRIPTIONS } from "../subscribers"

export async function startNats() {
  await initNats()

  for (const [name, fn] of Object.entries(SUBSCRIPTIONS)) {
    fn()
    console.log(`\x1B[35m[NATS]\x1B[0m ${name} subscribed`)
  }
}