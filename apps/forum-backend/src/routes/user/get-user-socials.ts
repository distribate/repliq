import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserSocials } from "#lib/queries/user/get-user-socials.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

export const getUserSocialsRoute = new Hono()
  .get("/get-user-socials/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    const initiator = getNickname()

    if (initiator !== nickname) {
      return ctx.json(null, 200);
    }

    try {
      const socials = await getUserSocials(nickname);
      return ctx.json(socials ?? null, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)