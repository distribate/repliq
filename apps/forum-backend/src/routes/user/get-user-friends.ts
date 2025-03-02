import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserFriends } from "#lib/queries/user/get-user-friends.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Encoder } from "cbor-x";
import { userPreferenceAndPrivateValidation } from "#utils/validate-user-preference-private.ts";

const encoder = new Encoder({ useRecords: false, structures: [], pack: true });

export const getUserFriendsRoute = new Hono()
  .get("/get-user-friends/:nickname", zValidator("query", getUserFriendsSchema), async (ctx) => {
    const { nickname: recipient } = ctx.req.param()
    const result = getUserFriendsSchema.parse(ctx.req.query());
    const initiator = getNickname()

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const friends = await getUserFriends({ nickname: recipient, ...result })

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