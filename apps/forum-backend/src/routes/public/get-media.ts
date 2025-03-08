import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getLink(type: string) {
  const query = await forumDB
    .selectFrom("links")
    .select("link")
    .where("value", "=", type)
    .executeTakeFirst()

  return query?.link ?? null
}

export const getMediaRoute = new Hono()
  .get("/get-media/:type", async (ctx) => {
    const { type } = ctx.req.param()

    if (!["discord", "telegram"].includes(type)) {
      return ctx.json({ error: "Invalid type" }, 404)
    }

    try {
      const link = await getLink(type)

      if (!link) {
        return ctx.json({ error: "Not found" }, 404)
      }

      return ctx.redirect(link)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })