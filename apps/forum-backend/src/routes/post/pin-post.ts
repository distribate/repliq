import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { zValidator } from "@hono/zod-validator"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { validatePostOwner } from "./delete-post"
import { z } from "zod"
import { forumDB } from "#shared/database/forum-db.ts"

const pinPostSchema = z.object({
  id: z.string(),
  value: z.boolean(),
})

async function pinPost(id: string, value: boolean) {
  return await forumDB
    .updateTable("posts")
    .set({ isPinned: value })
    .where("id", "=", id)
    .returning(["isPinned"])
    .executeTakeFirstOrThrow()
}

async function checkIsPinned(): Promise<boolean> {
  const { count } = await forumDB
  .selectFrom("posts")
  .select(forumDB.fn.countAll().as("count"))
  .$castTo<{ count: number }>()
  .where("isPinned", "=", true)
  .executeTakeFirstOrThrow()

  return count > 0
}

export const pinPostRoute = new Hono()
  .post("/pin-post", zValidator("json", pinPostSchema), async (ctx) => {
    const { id, value } = pinPostSchema.parse(await ctx.req.json())
    const nickname = getNickname()

    try {
      const isValid = await validatePostOwner(nickname, id)

      if (!isValid) {
        return ctx.json({ error: "You are not the owner of this post" }, 400)
      }

      const isPinned = await checkIsPinned()

      if (isPinned && value === true) {
        return ctx.json({ error: "Max number of pinned posts reached" }, 400)
      }

      const pinned = await pinPost(id, value)

      if (!pinned) {
        return ctx.json({ error: "Failed" }, 400)
      }

      return ctx.json({ data: pinned, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })