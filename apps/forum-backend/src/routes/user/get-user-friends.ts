import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserFriends } from "#lib/queries/user/get-user-friends.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Encoder } from "cbor-x";

export const getUserFriendsRoute = new Hono()
  .get("/get-user-friends/:nickname", zValidator("query", getUserFriendsSchema), async (ctx) => {
    const { nickname } = ctx.req.param()
    const query = ctx.req.query()
    const result = getUserFriendsSchema.parse(query);

    const initiator = getNickname()

    try {
      const friends = await getUserFriends({ nickname, ...result })

      const encoder = new Encoder({
        useRecords: false, structures: [], pack: true
      });

      const encodedFriends = encoder.encode(friends)

      return ctx.body(
        encodedFriends as unknown as ReadableStream, 
        200, 
        { 'Content-Type': 'application/cbor' }
      )
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })