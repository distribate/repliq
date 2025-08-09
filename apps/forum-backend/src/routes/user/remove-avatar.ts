import { deleteAvatar } from "#routes/user/upload-avatar.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export const removeAvatarRoute = new Hono()
  .delete("/remove-avatar/:id", async (ctx) => {
    const { id } = ctx.req.param()
    const nickname = getNickname()

    try {
      const data = await deleteAvatar(nickname, Number(id))

      if (!data) {
        throw new Error("Error for updating")
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }) 