import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserSocials } from "#lib/queries/user/get-user-socials.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

export const getUserSocialsRoute = new Hono()
  .get("/get-user-socials", async (ctx) => {
    const nickname = getNickname()

    try {
      const socials = await getUserSocials(nickname);

      return ctx.json({ data: socials ?? null }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)