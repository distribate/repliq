import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserDonate } from "#lib/queries/user/get-user-donate.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction.ts";
import { REACTIONS_LIMIT_DEFAULT, REACTIONS_LIMIT_PREMIUM } from "@repo/shared/constants/routes";

async function validateReactionLimit(nickname: string) {
  const userDonate = await getUserDonate(nickname)
  const hasAccess = userDonate.donate !== 'default'
  const limit = hasAccess ? REACTIONS_LIMIT_PREMIUM : REACTIONS_LIMIT_DEFAULT

  return limit
}

type GetReactionCount = {
  threadId: string
  nickname: string
}

async function getThreadReactionCount({ nickname, threadId }: GetReactionCount) {
  return await forumDB
    .selectFrom("threads_reactions")
    .select(forumDB.fn.countAll().as('count'))
    .where("thread_id", "=", threadId)
    .where("user_nickname", "=", nickname)
    .$castTo<{ count: number }>()
    .executeTakeFirstOrThrow()
}

export const createReactionRoute = new Hono()
  .post("/create-reaction", zValidator("json", createReactionSchema), async (ctx) => {
    const result = createReactionSchema.parse(await ctx.req.json())
    const { emoji, type, id } = result;

    const nickname = getNickname()
    const limit = await validateReactionLimit(nickname)

    try {
      switch (type) {
        case "thread":
          const threadId = id;
          const { count: reactionCount } = await getThreadReactionCount({ nickname, threadId })

          const reaction = await forumDB.transaction().execute(async (trx) => {
            const existingReaction = await trx
              .selectFrom("threads_reactions")
              .select("emoji")
              .where("thread_id", "=", threadId)
              .where("user_nickname", "=", nickname)
              .orderBy("created_at", "desc")
              .execute();

            if (existingReaction && existingReaction.some(r => r.emoji === emoji)) {
              await trx
                .deleteFrom("threads_reactions")
                .where("emoji", "=", existingReaction[0].emoji)
                .where("thread_id", "=", threadId)
                .where("user_nickname", "=", nickname)
                .execute()

              return "Deleted";
            }

            if (limit === 1) {
              const oldestReaction = await trx
                .selectFrom("threads_reactions")
                .select("id")
                .where("thread_id", "=", threadId)
                .where("user_nickname", "=", nickname)
                .orderBy("created_at", "asc")
                .limit(1)
                .executeTakeFirst();

              if (oldestReaction) {
                await trx
                  .deleteFrom("threads_reactions")
                  .where("id", "=", oldestReaction.id)
                  .execute();
              }
            } else {
              if (reactionCount >= limit) {
                const oldestReaction = await trx
                  .selectFrom("threads_reactions")
                  .select("id")
                  .where("thread_id", "=", threadId)
                  .where("user_nickname", "=", nickname)
                  .orderBy("created_at", "asc")
                  .limit(1)
                  .executeTakeFirst();

                if (oldestReaction) {
                  await trx
                    .deleteFrom("threads_reactions")
                    .where("id", "=", oldestReaction.id)
                    .execute();
                }
              }
            }

            await trx
              .insertInto("threads_reactions")
              // @ts-ignore
              .values({
                thread_id: threadId,
                user_nickname: nickname,
                emoji
              })
              .returning("id")
              .executeTakeFirst()

            return "Created";
          })
          return ctx.json({ status: reaction }, 200)
        case "post":

          return ctx.json({ error: "Not implemented" }, 400)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })