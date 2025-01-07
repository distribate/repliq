import { throwError } from "#helpers/throw-error.ts";
import { deleteFriendNote } from "#lib/queries/friend/delete-friend-note.ts";
import { getFriendId } from "#lib/queries/friend/get-friend-id.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteFriendNoteSchema } from "@repo/types/schemas/friend/delete-friend-note-schema.ts";

export const deleteFriendNoteRoute = new Hono()
  .delete("/delete-friend-note", zValidator("json", deleteFriendNoteSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = deleteFriendNoteSchema.parse(body);

    const initiator = getNickname()
    const { friend_id, recipient } = result

    try {
      const { id } = await getFriendId({
        friend_id, initiator, recipient
      })

      console.log(friend_id, id)

      await deleteFriendNote(id)
      return ctx.json({ status: "Friend note deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
)