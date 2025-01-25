import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getThreadReactions } from "#lib/queries/thread/get-thread-reactions.ts";
import { getThreadUserReactions } from "#lib/queries/thread/get-thread-user-reactions.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

export const getThreadUserReactionsRoute = new Hono()
  .get("/get-thread-user-reactions/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param();
    const nickname = getNickname()

    try {
      const [userReactions, threadReactions] = await Promise.all([
        getThreadUserReactions({ nickname, threadId }),
        getThreadReactions(threadId)
      ]);

      return ctx.json({ data: { userReactions, threadReactions } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )