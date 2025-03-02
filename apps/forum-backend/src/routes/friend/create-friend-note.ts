import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { createFriendNote } from "#lib/queries/friend/create-friend-note.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addFriendNoteSchema } from "@repo/types/schemas/friend/create-friend-note-schema.ts";

export const createFriendNoteRoute = new Hono()
  .post("/create-friend-note", zValidator("json", addFriendNoteSchema), async (ctx) => {
    const result = addFriendNoteSchema.parse(await ctx.req.json());
    const initiator = getNickname()

    try {
      const { note } = await createFriendNote({ ...result, initiator });

      return ctx.json({ status: "Friend note added", data: note }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });