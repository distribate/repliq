import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const createFriendPinSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  initiator: z.string(),
  type: z.enum(["pin", "unpin"])
})

async function createFriendPin({
  friend_id, recipient, initiator
}: Omit<z.infer<typeof createFriendPinSchema>, "type">) {
  return await forumDB
  .insertInto('friends_pinned')
  .values({
    initiator,
    recipient,
    friend_id
  })
  .returningAll()
  .executeTakeFirstOrThrow();
}

async function deleteFriendPin({
  friend_id, recipient, initiator
}: z.infer<typeof createFriendPinSchema>) {
  return await forumDB
  .deleteFrom('friends_pinned')
  .where("friend_id", "=", friend_id)
  .where("initiator", "=", initiator)
  .where("recipient", "=", recipient)
  .execute();
} 

export const createFriendPinRoute = new Hono()
  .post("/create-friend-pin", zValidator("json", createFriendPinSchema), async (ctx) => {
    const body = await ctx.req.json();
    const result = createFriendPinSchema.parse(body);
    
    try {
      switch (result.type) {
        case "pin":
          await createFriendPin(result)
          return ctx.json({ status: "Friend pinned" }, 200)
        case "unpin":
          await deleteFriendPin(result)
          return ctx.json({ status: "Friend unpinned" }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
)