import { loggerBot } from "../../shared/bot/bot";
import { z } from "zod"
import { pubDonatePayload } from "@repo/lib/publishers/pub-donate-payload.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";

const itemSchema = z.enum(["donate", "item", "charism", "belkoin"])
const donateSchema = z.enum(["arkhont", "authentic", "loyal"])

export type DonatePayload = {
  nickname: string,
  donate: z.infer<typeof donateSchema>
}

loggerBot.command("give", async (ctx) => {
  const text = ctx.text;

  if (!text) return;

  const args = ctx?.args?.split(/\s+/)
  const availableArgs = itemSchema.options.join(', ')

  if (!args) {
    return ctx.reply(`Args: ${availableArgs}`)
  }

  const itemType = itemSchema.safeParse(args[0])

  if (!args || !itemType.success) {
    return ctx.reply(`Arguments: ${availableArgs}`)
  }

  const nickname = args[1]
  const itemValue = args[2]

  switch (itemType.data) {
    case "donate":
      const donate = donateSchema.safeParse(itemValue)

      if (!donate.success) {
        return ctx.reply(`
          Command: /give donate [nickname] [donate].
          \nDonates available: ${donateSchema.options.join(", ")}
        `)
      }

      pubDonatePayload({ nickname, donate: donate.data })
      break;
    case "belkoin":
      const nc = getNatsConnection()

      const res = await nc.request("give.balance", "distribate")

      const data = res.json<{ result: string } | { error: string }>()

      if ("error" in data) {
        return ctx.reply(data.error)
      }

      console.log(data)
      break;
  }

  return ctx.send("Successfully gived")
})