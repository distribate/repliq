import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getDonatesList() {
  const query = await forumDB
    .selectFrom("landing_donate")
    .selectAll()
    .execute()

  return await Promise.all(query.map(async (donate) => {
    const imageUrl = donate.imageUrl

    const url = await getPublicUrl("static", imageUrl)

    return {
      ...donate,
      imageUrl: url.data.publicUrl
    }
  }))
}

export const getDonatesRoute = new Hono()
  .get("/get-donates", async (ctx) => {
    try {
      const donates = await getDonatesList();

      return ctx.json({ data: donates }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })