import { donateSchema } from '@repo/types/schemas/payment/payment-schema';
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { z } from "zod"

export type DonatePayload = {
  nickname: string,
  donate: z.infer<typeof donateSchema>
}

export async function pubDonatePayload(payload: DonatePayload) {
  try {
    const nc = getNatsConnection()
    return nc.publish("server.give.donate", JSON.stringify(payload))
  } catch (e) {
    console.error(e)
  }
}