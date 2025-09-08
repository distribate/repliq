import { throwError } from '#utils/throw-error.ts';
import { removeThread } from "#lib/queries/thread/remove-thread.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { validateThreadOwner } from "#lib/validators/validate-thread-owner.ts";

export const removeThreadRoute = new Hono()
  .delete("/remove/:id", async (ctx) => {
    const id = ctx.req.param("id")
    const nickname = getNickname()

    const isValid = await validateThreadOwner(nickname, id)

    if (!isValid) {
      return ctx.json({ error: "You are not the owner of this thread" }, 400)
    }

    try {
      const deletedThread = await removeThread(id)

      if (!deletedThread?.numDeletedRows) {
        return ctx.json({ error: "Error deleting thread" }, 404)
      }

      const data = {
        status: "Success"
      }

      return ctx.json({ data }, 200)
    } catch (error) {
      return ctx.json({ error: throwError(error) }, 500);
    }
  })