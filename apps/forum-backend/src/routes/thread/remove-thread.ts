import { throwError } from "#helpers/throw-error.ts";
import { removeThread } from "#lib/queries/thread/remove-thread.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

async function getThreadOwner(nickname: string, threadId: string) {
  return await forumDB
    .selectFrom("threads_users")
    .select(["user_nickname"])
    .where("thread_id", "=", threadId)
    .where("user_nickname", "=", nickname)
    .executeTakeFirst()
}

export const removeThreadRoute = new Hono()
  .delete("/remove-thread/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param()

    const nickname = getNickname()

    const threadOwner = await getThreadOwner(nickname, threadId)

    if (!threadOwner || (threadOwner && threadOwner.user_nickname !== nickname)) {
      return ctx.json({ error: "You are not the owner of this thread" }, 400)
    }

    try {
      const deletedThread = await removeThread(threadId)

      return ctx.json(deletedThread, 200)
    } catch (error) {
      return ctx.json({ error: throwError(error) }, 500);
    }
  })