import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const deleteUserFromBlockedSchema = z.object({
  initiator: z.string(),
  recipient: z.string(),
  type: z.enum(["block", "unblock"])
})

async function deleteUserFromBlocked({
  initiator, recipient
}: Omit<z.infer<typeof deleteUserFromBlockedSchema>, "type">) {
  return await forumDB
  .deleteFrom('users_blocked')
  .where("initiator", "=", initiator)
  .where("recipient", "=", recipient)
  .execute();
}

async function addUserToBlocked({
  initiator, recipient
}: Omit<z.infer<typeof deleteUserFromBlockedSchema>, "type">) {
  return await forumDB
  .insertInto('users_blocked')
  .values({ initiator, recipient })
  .returningAll()
  .executeTakeFirstOrThrow();
}

export const controlUserBlockedRoute = new Hono()
  .post("/control-user-blocked", zValidator("json", deleteUserFromBlockedSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = deleteUserFromBlockedSchema.parse(body);

    try {
      switch (result.type) {
        case "block":
          await addUserToBlocked(result)
          return ctx.json({ status: "User added to blocked" }, 200);
        case "unblock":
          await deleteUserFromBlocked(result)
          return ctx.json({ status: "User deleted from blocked" }, 200);
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
)