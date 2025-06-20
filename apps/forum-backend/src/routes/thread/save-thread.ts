import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export const unsaveThreadRoute = new Hono()
  .post("/unsave-thread/:id", async (ctx) => { 
    const nickname = getNickname()
    const id = ctx.req.param("id")

    try {
      const query = await forumDB
        .deleteFrom("threads_saved")
        .where("thread_id", "=", id)
        .where("nickname", "=", nickname)
        .returning('id')
        .executeTakeFirst()

      if (!query?.id) {
        return ctx.json({ error: "Error" }, 502)
      }

      return ctx.json({ data: query.id }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })

export const saveThreadRoute = new Hono()
  .post("/save-thread/:id", async (ctx) => {
    const nickname = getNickname()
    const id = ctx.req.param("id")

    try {
      const query = await forumDB
        .insertInto("threads_saved")
        .onConflict((oc) => oc
          .columns(['nickname', 'thread_id'])
          .doNothing()
        )
        .values({ nickname, thread_id: id })
        .returning('id')
        .executeTakeFirst()

      if (!query?.id) {
        return ctx.json({ error: "Error" }, 502)
      }

      return ctx.json({ data: query.id }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })