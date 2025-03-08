import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { createFriendRequest } from "#lib/queries/friend/create-friend-request.ts";
import { getFriendship } from "#lib/queries/friend/get-friendship.ts";
import { getUserBlockStatus } from "#lib/queries/user/get-user-block-status.ts";
import { getUserFriendPreference } from "#lib/queries/user/get-user-friend-preference.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createFriendRequestSchema } from "@repo/types/schemas/friend/create-friend-request-schema.ts";
import { publishCreateFriendRequest } from '#publishers/pub-create-friend-request.ts';
import { pushNotificationOnClient } from '@repo/lib/utils/push-notifications-on-client.ts';

export const createFriendRequestRoute = new Hono()
  .post("/create-friend-request", zValidator("json", createFriendRequestSchema), async (ctx) => {
    const { recipient } = createFriendRequestSchema.parse(await ctx.req.json());
    const initiator = getNickname()

    const isValid = await getUserFriendPreference(recipient);

    if (!isValid) {
      return ctx.json({ error: "User does not have accept to send friend request" }, 400);
    }

    if (initiator === recipient) {
      return ctx.json({ error: "You cannot add yourself" }, 400);
    }

    const blockStatus = await getUserBlockStatus({ initiator, recipient });

    switch (blockStatus) {
      case "blocked-by-user":
        return ctx.json({ error: "You are blocked by the user" }, 400);
      case "blocked-by-you":
        return ctx.json({ error: "User blocked you" }, 400);
    }

    const existingFriendShip = await getFriendship({ initiator, recipient });

    if (existingFriendShip) {
      return ctx.json({ error: "You are already friends" }, 400);
    }

    try {
      const res = await createFriendRequest({ initiator, recipient });

      if (!res.id) {
        return ctx.json({ error: "Error creating friend request" }, 404);
      }

      publishCreateFriendRequest({ initiator, recipient })

      pushNotificationOnClient({
        event: "create-friend-request",
        data: { initiator, recipient }
      })

      return ctx.json({ status: "Friend request sent" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });