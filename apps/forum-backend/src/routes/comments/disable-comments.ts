import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { z } from "zod"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts"

const disableCommentsSchema = z.object({
  id: z.string(),
  type: z.enum(["post", "thread"])
})

async function disablePostComments(id: string) {
  const query = await forumDB
    .updateTable("posts")
    .set({ isComments: true })
    .where("id", "=", id)
    .returning(["isComments"])
    .executeTakeFirstOrThrow()

  return query;
}

async function disableThreadComments(id: string) {
  const query = await forumDB
    .updateTable("threads")
    .set({ is_comments: true })
    .where("id", "=", id)
    .returning(["is_comments"])
    .executeTakeFirstOrThrow()

  return query;
}

export const disableCommentsRoute = new Hono()
  .post("/disable-comments", zValidator("json", disableCommentsSchema), async (ctx) => {
    const nickname = getNickname()
    const { id: postId, type } = disableCommentsSchema.parse(await ctx.req.json())

    try {
      switch (type) {
        case "post":
          const isValid = await validatePostOwner({ nickname, postId })

          if (!isValid) {
            return ctx.json({ error: "You are not the owner of this post" }, 400)
          }

          const post = await disablePostComments(postId)

          if (!post) {
            return ctx.json({ error: "Failed" }, 400)
          }

          return ctx.json({ data: post, status: "Success" }, 200)
        case "thread":
          const thread = await disableThreadComments(postId)

          if (!thread) {
            return ctx.json({ error: "Failed" }, 400)
          }

          return ctx.json({ data: thread, status: "Success" }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })