import { throwError } from '#utils/throw-error.ts';
import { getThreadReactions } from "#lib/queries/thread/get-thread-reactions.ts";
import { getThreadUserReactions } from "#lib/queries/thread/get-thread-user-reactions.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

export const getThreadReactionsRoute = new Hono()
  .get("/reactions/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const nickname = getNickname()

    try {
      const [byUser, byThread] = await Promise.all([
        getThreadUserReactions({ nickname, threadId: id }),
        getThreadReactions(id)
      ]);

      return ctx.json({ data: { byUser, byThread } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })