import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator"
import { throwError } from "#utils/throw-error.ts"
import { Hono } from "hono"
import * as z from "zod"
import { getNickname } from "#lib/modules/context.ts"
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts"

const editPostSchema = z.object({
  id: z.string(),
  content: z.string()
})

type EditPost = {
  postId: string
  content: string
}

async function editPost({ postId, content }: EditPost) {
  const query = await forumDB
    .updateTable("posts")
    .set({ content })
    .where("id", "=", postId)
    .returning(["content"])
    .executeTakeFirstOrThrow()

  return query;
}

export const editPostRoute = new Hono()
  .post("/edit", zValidator("json", editPostSchema), async (ctx) => {
    const { id: postId, content } = editPostSchema.parse(await ctx.req.json())
    const nickname = getNickname()

    try {
      const isValid = await validatePostOwner({ nickname, postId })

      if (!isValid) {
        return ctx.json({ error: "You are not the owner of this post" }, 400)
      }

      const post = await editPost({ postId, content })

      if (!post || !post.content) {
        return ctx.json({ error: "Failed" }, 400)
      }

      const data = {
        data: post,
        status: "Success"
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })