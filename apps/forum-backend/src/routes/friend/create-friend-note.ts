import { throwError } from "#helpers/throw-error.ts";
import { createFriendNote } from "#lib/queries/friend/create-friend-note.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const addFriendNoteSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  message: z.string(),
})

export const createFriendNoteRoute = new Hono()
  .post("/create-friend-note", zValidator("json", addFriendNoteSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = addFriendNoteSchema.parse(body);

    const initiator = getNickname()

    try {
      const { note: newNote } = await createFriendNote({ ...result, initiator })
      return ctx.json({ status: "Friend note added", note: newNote }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
);