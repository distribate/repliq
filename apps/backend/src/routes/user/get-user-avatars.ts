import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const getUserAvatarsRoute = new Hono()
  .get("/get-user-avatars/:nickname", async (ctx) => {
    const nickname = ctx.req.param("nickname");

    try {
      const data = await forumDB
        .selectFrom("users")
        .select(["avatars", 'avatar'])
        .where("nickname", "=", nickname)
        .orderBy("created_at", "desc")
        .executeTakeFirstOrThrow()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })