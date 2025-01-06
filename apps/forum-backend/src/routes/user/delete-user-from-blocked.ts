import { throwError } from "#helpers/throw-error.ts";
import { addUserToBlocked } from "#lib/queries/user/add-user-to-blocked.ts";
import { deleteUserFromBlocked } from "#lib/queries/user/delete-user-from-blocked.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const deleteUserFromBlockedSchema = z.object({
  recipient: z.string(),
  type: z.enum(["block", "unblock"])
})

export type UserFromBlocked = Omit<z.infer<typeof deleteUserFromBlockedSchema>, "type"> & {
  initiator: string
}

export const controlUserBlockedRoute = new Hono()
  .post("/control-user-blocked", zValidator("json", deleteUserFromBlockedSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = deleteUserFromBlockedSchema.parse(body);

    const initiator = getNickname()

    try {
      switch (result.type) {
        case "block":
          await addUserToBlocked({ ...result, initiator })
          return ctx.json({ status: "User added to blocked" }, 200);
        case "unblock":
          await deleteUserFromBlocked({ ...result, initiator })
          return ctx.json({ status: "User deleted from blocked" }, 200);
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
  )