import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { z } from "zod"
import { validatePostOwner } from "../post/delete-post"
import { getNickname } from "#utils/get-nickname-from-storage.ts"

const disableCommentsSchema = z.object({
  id: z.string(),
  type: z.enum(["post", "thread"])
})

async function disablePostComments(id: string) {
  return await forumDB
    .updateTable("posts")
    .set({ isComments: true })
    .where("id", "=", id)
    .returning(["isComments"])
    .executeTakeFirstOrThrow()
}

async function disableThreadComments(id: string) {
  return await forumDB
    .updateTable("threads")
    .set({ is_comments: true })
    .where("id", "=", id)
    .returning(["is_comments"])
    .executeTakeFirstOrThrow()
}

export const disableCommentsRoute = new Hono()
  .post("/disable-comments", zValidator("json", disableCommentsSchema), async (ctx) => {
    const nickname = getNickname()
    const { id, type } = disableCommentsSchema.parse(await ctx.req.json())

    try {
      switch (type) {
        case "post":
          const isValid = await validatePostOwner(nickname, id)

          if (!isValid) {
            return ctx.json({ error: "You are not the owner of this post" }, 400)
          }

          const post = await disablePostComments(id)

          if (!post) {
            return ctx.json({ error: "Failed" }, 400)
          }

          return ctx.json({ data: post, status: "Success" }, 200)
        case "thread":
          const thread = await disableThreadComments(id)

          if (!thread) {
            return ctx.json({ error: "Failed" }, 400)
          }

          return ctx.json({ data: thread, status: "Success" }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })