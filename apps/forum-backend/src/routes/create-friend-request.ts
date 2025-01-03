import { throwError } from "#helpers/throw-error.ts";
import { createFriendRequest } from "#lib/queries/create-friend-request.ts";
import { getFriendship } from "#lib/queries/get-friendship.ts";
import { getUserBlockStatus } from "#lib/queries/get-user-block-status.ts";
import { getUserFriendPreference } from "#lib/queries/get-user-friend-preference.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const friendRequestSchema = z.object({
  currentUserNickname: z.string(),
  requestedUserNickname: z.string(),
  friend_id: z.string().optional(),
});

async function validateUserFriendPreference(nickname: string): Promise<boolean> {
  return await getUserFriendPreference(nickname)
}

export const createFriendRequestRoute = new Hono()
  .post("/create-friend-request", zValidator("json", friendRequestSchema), async (ctx) => {
    const { currentUserNickname, requestedUserNickname } = await ctx.req.json();

    if (!(await validateUserFriendPreference(requestedUserNickname))) {
      return ctx.json(
        { error: "User does not have accept to send friend request" },
        400
      );
    }

    if (currentUserNickname === requestedUserNickname) {
      return ctx.json({ error: "You cannot add yourself" }, 400);
    }

    const blockStatus = await getUserBlockStatus(currentUserNickname, requestedUserNickname);

    switch (blockStatus) {
      case "blocked-by-user":
        return ctx.json({ error: "You are blocked by the user" }, 400);
      case "blocked-by-you":
        return ctx.json({ error: "User blocked you" }, 400);
    }

    const existingFriendShip = await getFriendship(currentUserNickname, requestedUserNickname);

    if (existingFriendShip) {
      return ctx.json({ error: "You are already friends" }, 400);
    }

    try {
      await createFriendRequest(currentUserNickname, requestedUserNickname);
      return ctx.json({ status: "Friend request sent" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });