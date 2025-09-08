import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import { forumDB } from "#shared/database/forum-db.ts";


type DeleteUserFromBlocked = InitiatorRecipientType

async function deleteUserFromBlocked({
  initiator, recipient
}: DeleteUserFromBlocked) {
  return forumDB
    .deleteFrom('users_blocked')
    .where("initiator", "=", initiator)
    .where("recipient", "=", recipient)
    .executeTakeFirst();
}

export const deleteUserFromBlockedSchema = z.object({
  recipient: z.string(),
  type: z.enum(["block", "unblock"])
})

export type UserFromBlocked = Omit<z.infer<typeof deleteUserFromBlockedSchema>, "type"> & {
  initiator: string
}

type AddUserToBlocked = InitiatorRecipientType

async function addUserToBlocked({
  initiator, recipient
}: AddUserToBlocked) {
  return forumDB
    .insertInto('users_blocked')
    .values({ initiator, recipient })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export const controlUserBlockedRoute = new Hono()
  .post("/control-user-blocked", zValidator("json", deleteUserFromBlockedSchema), async (ctx) => {
    const result = deleteUserFromBlockedSchema.parse(await ctx.req.json());
    const initiator = getNickname()

    try {
      switch (result.type) {
        case "block":
          const added = await addUserToBlocked({ ...result, initiator })

          if (!added.id) {
            return ctx.json({ error: "Error adding user to blocked" }, 404);
          }

          return ctx.json({ status: "User added to blocked" }, 200);
        case "unblock":
          const deleted = await deleteUserFromBlocked({ ...result, initiator })

          if (!deleted.numDeletedRows) {
            return ctx.json({ error: "Error deleting user from blocked" }, 404);
          }

          return ctx.json({ status: "User deleted from blocked" }, 200);
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })