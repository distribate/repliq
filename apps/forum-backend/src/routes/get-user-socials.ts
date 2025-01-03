import { throwError } from "#helpers/throw-error.ts";
import { authDB } from "#shared/database/auth-db.ts"
import { Hono } from "hono";

async function getUserSocials(nickname: string) {
  return await authDB
    .selectFrom("SOCIAL")
    .select([
      "DISCORD_ID",
      "TELEGRAM_ID",
    ])
    .where("LOWERCASENICKNAME", "=", nickname)
    .executeTakeFirst()
}

export const getUserSocialsRoute = new Hono()
  .get("/get-user-socials/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const socials = await getUserSocials(nickname);
      return ctx.json(socials ?? null, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)