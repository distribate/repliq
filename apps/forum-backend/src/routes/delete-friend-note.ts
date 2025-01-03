import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const deleteFriendNoteSchema = z.object({
  recipient: z.string(),
  friend_id: z.string(),
  initiator: z.string(),
})

async function deleteFriendNote(note_id: string) {
  return await forumDB
  .deleteFrom('friends_notes')
  .where('id', '=', note_id)
  .execute();
}

export const deleteFriendNoteRoute = new Hono()
  .delete("/delete-friend-note", zValidator("json", deleteFriendNoteSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = deleteFriendNoteSchema.parse(body);

    try {
      const { id } = await forumDB.selectFrom("friends_notes")
      .select("id")
      .where("recipient", "=", result.recipient)
      .where("friend_id", "=", result.friend_id)
      .where("initiator", "=", result.initiator)
      .executeTakeFirstOrThrow();
      
      await deleteFriendNote(id)
      return ctx.json({ status: "Friend note deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
)