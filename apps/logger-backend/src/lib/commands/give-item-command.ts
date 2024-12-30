import { loggerBot } from "../../shared/bot/bot";
import { z } from "zod"
import { pubDonatePayload } from "@repo/utils/nats/publishers/pub-donate-payload.ts"  

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

      await pubDonatePayload({
        nickname, donate: donate.data
      })
      break;
    case "belkoin":
      
  }

  return ctx.send("Successfully gived")
})