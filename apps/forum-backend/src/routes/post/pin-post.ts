import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { zValidator } from "@hono/zod-validator"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import * as z from "zod"
import { forumDB } from "#shared/database/forum-db.ts"
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts"

const pinPostSchema = z.object({
  id: z.string(),
  value: z.boolean(),
})

type PinPost = {
  postId: string;
  value: boolean;
}

async function pinPost({ postId, value }: PinPost) {
  const query = await forumDB
    .updateTable("posts")
    .set({ isPinned: value })
    .where("id", "=", postId)
    .returning(["isPinned"])
    .executeTakeFirstOrThrow()

  return query;
}

async function checkIsPinned(nickname: string): Promise<boolean> {
  const exists = await forumDB
    .selectFrom("posts")
    .innerJoin("posts_users", "posts_users.post_id", "posts.id")
    .select("posts.id")
    .where("posts_users.nickname", "=", nickname)
    .where("isPinned", "=", true)
    .executeTakeFirst()

  return !!exists
}

export const pinPostRoute = new Hono()
  .post("/pin-post", zValidator("json", pinPostSchema), async (ctx) => {
    const { id: postId, value } = pinPostSchema.parse(await ctx.req.json())
    const nickname = getNickname()

    try {
      const isValid = await validatePostOwner({ nickname, postId })

      if (!isValid) {
        return ctx.json({ error: "You are not the owner of this post" }, 400)
      }

      const isPinned = await checkIsPinned(nickname)

      if (isPinned && value === true) {
        return ctx.json({ error: "Max number of pinned posts reached" }, 400)
      }

      const pinned = await pinPost({ postId, value })

      if (!pinned) {
        return ctx.json({ error: "Failed" }, 400)
      }

      return ctx.json({ data: pinned, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })