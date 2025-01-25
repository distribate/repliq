import { getNatsConnection } from "@repo/config-nats/nats-client"
import { z } from "zod"
import { donateSchema } from '@repo/types/schemas/entities/donate-schema';

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