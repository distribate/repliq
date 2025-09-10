import { getNickname } from "#lib/modules/context.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { deleteAvatar } from "./create-avatar";

export const removeAvatarRoute = new Hono()
  .delete("/remove/:id", async (ctx) => {
    const id = ctx.req.param("id")
    const nickname = getNickname()

    try {
      const data = await deleteAvatar(nickname, Number(id))

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }) 