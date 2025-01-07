import { throwError } from "#helpers/throw-error.ts";
import { getUserDonate } from "#lib/queries/user/get-user-donate.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction.ts";
import { REACTIONS_LIMIT_DEFAULT, REACTIONS_LIMIT_PREMIUM } from "@repo/shared/constants/routes";

export const createReactionRoute = new Hono()
  .post("/create-reaction", zValidator("json", createReactionSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = createReactionSchema.parse(body)

    const { emoji, type, id } = result
    const nickname = getNickname()
    const userDonate = await getUserDonate(nickname)

    const hasAccess = userDonate.donate !== 'default'
    const limit = hasAccess ? REACTIONS_LIMIT_PREMIUM : REACTIONS_LIMIT_DEFAULT

    try {
      switch (type) {
        case "thread":
          const threadId = id

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
        case "post":
          // todo
          return ctx.json({ error: "Not implemented" }, 400)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })