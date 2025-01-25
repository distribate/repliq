import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

export const getRecommendedFriendsRoute = new Hono()
  .get("/get-recommended-friends", async (ctx) => {
    const nickname = getNickname()



    try {
      // TODO: implement get recommended friends

      return ctx.json({ data: [] }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )