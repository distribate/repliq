import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const addFriendNoteSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  initiator: z.string(),
  message: z.string(),
})

async function createFriendNote({
  friend_id, recipient, initiator, message,
}: z.infer<typeof addFriendNoteSchema>) {
  return await forumDB
    .insertInto('friends_notes')
    .values({
      friend_id: friend_id,
      recipient: recipient,
      initiator: initiator,
      note: message,
    })
    .onConflict((oc) => oc
      .columns(['friend_id', 'initiator', 'recipient'])
      .doUpdateSet({
        note: message
      })
    )
    .returning('note')
    .executeTakeFirstOrThrow();
}

export const createFriendNoteRoute = new Hono()
  .post("/create-friend-note", zValidator("json", addFriendNoteSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = addFriendNoteSchema.parse(body);

    try {
      const { note: newNote } = await createFriendNote(result)
      return ctx.json({ status: "Friend note added", note: newNote }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
  );