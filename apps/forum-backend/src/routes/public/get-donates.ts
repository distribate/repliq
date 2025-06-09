import { paymentsDB } from "#shared/database/payments-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono";
import { z } from "zod/v4";

async function getDonatesByType(args: z.infer<typeof getDonatesSchema>) {
  switch (args.type) {
    case "donate":
      const donateQuery = await paymentsDB
        .selectFrom("donate")
        .selectAll()
        .orderBy("id", "asc")
        .execute()

      return donateQuery.map((donate) => {
        const imageUrl = donate.imageUrl
        const url = getPublicUrl(STATIC_IMAGES_BUCKET, imageUrl)

        return { ...donate, imageUrl: url }
      })
    case "wallet":
      const walletQuery = await paymentsDB
        .selectFrom("economy")
        .select(eb => [
          "type", 
          eb.cast<number>("value", "integer").as("value")
        ])
        // order when charism is first
        .orderBy("type", "asc")
        .execute()

      return walletQuery
    case "events":
      // const eventsQuery = await paymentsDB
      //   .selectFrom("events")
      //   .selectAll()
      //   .execute()

      const events = [
        {
          type: "player",
          title: "Телепорт на спавн",
          description: "Телепортировать выбранного игрока на спавн",
          wallet: "charism",
          price: 10
        }
      ]

      return events
    default:
      throw new Error("Invalid type")
  }
}

const getDonatesSchema = z.object({
  type: z.enum(["donate", "wallet", "events"])
})

export const getDonatesRoute = new Hono()
  .get("/get-donates", zValidator("query", getDonatesSchema), async (ctx) => {
    const result = getDonatesSchema.parse(ctx.req.query());

    try {
      const donates = await getDonatesByType(result);

      return ctx.json({ data: donates }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })