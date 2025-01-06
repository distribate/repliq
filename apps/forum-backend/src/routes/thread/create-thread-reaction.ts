import { throwError } from "#helpers/throw-error.ts";
import { getUserDonate } from "#lib/queries/user/get-user-donate.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const createThreadReactionSchema = z.object({
  emoji: z.string(),
})

const REACTIONS_LIMIT_DEFAULT = 1;
const REACTIONS_LIMIT_PREMIUM = 3;

export const createThreadReactionRoute = new Hono()
  .post("/create-thread-reaction/:threadId", zValidator("json", createThreadReactionSchema), async (ctx) => {
    const { threadId } = ctx.req.param()
    const body = await ctx.req.json()
    const result = createThreadReactionSchema.parse(body)

    const { emoji } = result
    const nickname = getNickname()
    const userDonate = await getUserDonate(nickname)

    const hasAccess = userDonate.donate !== 'default'
    const limit = hasAccess ? REACTIONS_LIMIT_PREMIUM : REACTIONS_LIMIT_DEFAULT

    try {
      const reactionCount = await forumDB
        .selectFrom("threads_reactions")
        .select(forumDB.fn.countAll().as('count'))
        .where("thread_id", "=", threadId)
        .where("user_nickname", "=", nickname)
        .executeTakeFirstOrThrow()

      const count = Number(reactionCount.count);

      const reaction = await forumDB.transaction().execute(async (trx) => {
        const existingReaction = await trx
          .selectFrom("threads_reactions")
          .where("emoji", "=", emoji)
          .where("thread_id", "=", threadId)
          .where("user_nickname", "=", nickname)
          .executeTakeFirst()

        if (existingReaction) {
          await trx
            .deleteFrom("threads_reactions")
            .where("emoji", "=", emoji)
            .where("thread_id", "=", threadId)
            .where("user_nickname", "=", nickname)
            .execute()
          return "Deleted";
        }

        if (count >= limit) {
          return "Limit exceeded"
        }

        await trx
          .insertInto("threads_reactions")
          // @ts-ignore
          .values({
            thread_id: threadId,
            user_nickname: nickname,
            emoji,
          })
          .returning("id")
          .executeTakeFirst()

        return "Created";
      })

      return ctx.json({ status: reaction }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })