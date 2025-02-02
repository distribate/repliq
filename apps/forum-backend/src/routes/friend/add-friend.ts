import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { createFriendRequest } from "#lib/queries/friend/create-friend-request.ts";
import { getUserFriendPreference } from "#lib/queries/user/get-user-friend-preference.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const addFriendSchema = z.object({
  recipient: z.string(),
  initiator: z.string()
})

async function validateUserFriendPreference(nickname: string): Promise<boolean> {
  return await getUserFriendPreference(nickname)
}

export const addFriendRoute = new Hono()
  .post("/add-friend", zValidator("json", addFriendSchema), async (ctx) => {
    const { initiator, recipient } = addFriendSchema.parse(await ctx.req.json())

    if (!validateUserFriendPreference(recipient)) {
      return ctx.json({ error: "User does not have accept to send friend request" }, 200)
    }

    if (initiator === recipient) {
      return ctx.json({ error: "You cannot add yourself" }, 400)
    }

    try {
      const createRequest = await createFriendRequest({
        initiator, recipient
      })

      if (!createRequest.id) {
        return ctx.json({ error: "Error sending friend request" }, 404)
      }

      return ctx.json({ data: createRequest.id }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  }
  )