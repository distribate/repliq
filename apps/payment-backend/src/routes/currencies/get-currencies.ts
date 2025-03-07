import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { STATIC_IMAGES_BUCKET } from '@repo/shared/constants/buckets';

async function getCurrencies() {
  const query = await forumDB
    .selectFrom("landing_currencies")
    .select(["id", "value", "imageUrl", "title", "isAvailable"])
    .where("public", "=", true)
    .execute()

  return query.map(currency => ({
    ...currency,
    imageUrl: getPublicUrl(STATIC_IMAGES_BUCKET, currency.imageUrl)
  }))
}

export const getCurrenciesRoute = new Hono()
  .get("/get-currencies", async (ctx) => {

    try {
      const currencies = await getCurrencies()

      return ctx.json({ data: currencies }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })