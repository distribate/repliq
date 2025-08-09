import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { deleteCoverImage } from "./create-cover-image"

export const deleteCoverImageRoute = new Hono()
  .delete("/delete-cover-image", async (ctx) => {
    const nickname = getNickname()

    try {
      const res = await deleteCoverImage(nickname)

      if (!res) {
        return ctx.json({ error: "Error deleting cover image" }, 404)
      }

      return ctx.json({ data: res, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })