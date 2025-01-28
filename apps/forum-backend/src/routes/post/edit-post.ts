import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { z } from "zod"
import { validatePostOwner } from "./delete-post"
import { getNickname } from "#utils/get-nickname-from-storage.ts"

const editPostSchema = z.object({
  id: z.string(),
  content: z.string()
})

async function editPost(id: string, content: string) {
  return await forumDB
    .updateTable("posts")
    .set({ content })
    .where("id", "=", id)
    .returning(["content"])
    .executeTakeFirstOrThrow()
}

export const editPostRoute = new Hono()
  .post("/edit-post", zValidator("json", editPostSchema), async (ctx) => {
    const { id, content } = editPostSchema.parse(await ctx.req.json())
    const nickname = getNickname()

    try {
      const isValid = await validatePostOwner(nickname, id)

      if (!isValid) {
        return ctx.json({ error: "You are not the owner of this post" }, 400)
      }

      const post = await editPost(id, content)

      if (!post.content) {
        return ctx.json({ error: "Failed" }, 400)
      }

      return ctx.json({ data: post, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })