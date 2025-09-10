import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#lib/modules/context.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const unsaveThreadRoute = new Hono()
  .post("/unsave/:id", async (ctx) => {
    const id = ctx.req.param("id")
    const nickname = getNickname()

    try {
      const { id: data } = await forumDB
        .deleteFrom("threads_saved")
        .where("thread_id", "=", id)
        .where("nickname", "=", nickname)
        .returning('id')
        .executeTakeFirstOrThrow()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })

export const saveThreadRoute = new Hono()
  .post("/save/:id", async (ctx) => {
    const id = ctx.req.param("id")
    const nickname = getNickname()

    try {
      const { id: data } = await forumDB
        .insertInto("threads_saved")
        .onConflict((oc) => oc
          .columns(['nickname', 'thread_id'])
          .doNothing()
        )
        .values({ nickname, thread_id: id })
        .returning('id')
        .executeTakeFirstOrThrow()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })