import { throwError } from '#utils/throw-error.ts';
import { deleteFriendNote } from "#lib/queries/friend/delete-friend-note.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteFriendNoteSchema } from "@repo/types/schemas/friend/delete-friend-note-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type GetFriendId = InitiatorRecipientType & {
  friend_id: string
}

const getFriendId = async ({
  friend_id, initiator, recipient
}: GetFriendId) => {
  return forumDB
    .selectFrom("friends_notes")
    .select("id")
    .where("recipient", "=", recipient)
    .where("friend_id", "=", friend_id)
    .where("initiator", "=", initiator)
    .executeTakeFirstOrThrow();
}

export const deleteFriendNoteRoute = new Hono()
  .delete("/delete-friend-note", zValidator("json", deleteFriendNoteSchema), async (ctx) => {
    const { friend_id, recipient } = deleteFriendNoteSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const { id } = await getFriendId({
        friend_id, initiator: nickname, recipient
      })

      const res = await deleteFriendNote(id)

      if (!res.numDeletedRows) {
        return ctx.json({ error: "Error deleting friend note" }, 404)
      }

      return ctx.json({ status: "Friend note deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
)