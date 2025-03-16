import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { removeThread } from "#lib/queries/thread/remove-thread.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { validateThreadOwner } from "#lib/validators/validate-thread-owner.ts";

export const removeThreadRoute = new Hono()
  .delete("/remove-thread/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param()
    const nickname = getNickname()

    const isValid = await validateThreadOwner(nickname, threadId)

    if (!isValid) {
      return ctx.json({ error: "You are not the owner of this thread" }, 400)
    }

    try {
      const deletedThread = await removeThread(threadId)

      if (!deletedThread || !deletedThread.id) {
        return ctx.json({ error: "Error deleting thread" }, 404)
      }

      return ctx.json({ status: "Success" }, 200)
    } catch (error) {
      return ctx.json({ error: throwError(error) }, 500);
    }
  })