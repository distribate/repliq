import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { createFriendPin } from "#lib/queries/friend/create-friend-pin.ts";
import { deleteFriendPin } from "#lib/queries/friend/delete-friend-pin.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { friendPinSchema } from "@repo/types/schemas/friend/friend-pin-schema.ts";
import { forumDB } from '#shared/database/forum-db.ts';

async function validateFriendPin(nickname: string) {
  const exists = await forumDB
    .selectFrom("friends_pinned")
    .select("id")
    .where("initiator", "=", nickname)
    .execute()

  return exists.length < 1
}

export const createFriendPinRoute = new Hono()
  .post("/create-friend-pin", zValidator("json", friendPinSchema), async (ctx) => {
    const result = friendPinSchema.parse(await ctx.req.json());

    const initiator = getNickname()

    try {
      switch (result.type) {
        case "pin":
          // only 1 pin per user
          const isValid = await validateFriendPin(initiator)

          if (!isValid) {
            return ctx.json({ error: "Error creating friend pin" }, 404)
          }

          const createPin = await createFriendPin({ ...result, initiator })

          if (!createPin.id) {
            return ctx.json({ error: "Error creating friend pin" }, 404)
          }

          return ctx.json({ status: "Friend pinned" }, 200)
        case "unpin":
          const deletePin = await deleteFriendPin({ ...result, initiator })

          if (!deletePin[0].numDeletedRows) {
            return ctx.json({ error: "Error deleting friend pin" }, 404)
          }

          return ctx.json({ status: "Friend unpinned" }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })