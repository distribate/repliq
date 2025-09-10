import { throwError } from '#utils/throw-error.ts';
import { createFriendNote } from "#lib/queries/friend/create-friend-note.ts";
import { getNickname } from "#lib/modules/context.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addFriendNoteSchema } from "@repo/types/schemas/friend/create-friend-note-schema.ts";

export const createFriendNoteRoute = new Hono()
  .post("/create-note", zValidator("json", addFriendNoteSchema), async (ctx) => {
    const result = addFriendNoteSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const { note } = await createFriendNote({ ...result, initiator: nickname });

      const data = {
        data: note, 
        status: "Friend note added"
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });