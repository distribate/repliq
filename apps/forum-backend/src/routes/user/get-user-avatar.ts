import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getAvatar(nickname: string) {
  const query = await forumDB
    .selectFrom("users")
    .select("avatar")
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  return query?.avatar;
}

function getAvatarUrl(url: string) {
  return getPublicUrl("users_avatar", url)
}

export const getUserAvatarRoute = new Hono()
  .get("/get-user-avatar/:nickname", async (ctx) => {
    const nickname = ctx.req.param("nickname")

    try {
      const data = await getAvatar(nickname)

      let url: string | null = null;

      if (data) {
        url = getAvatarUrl(data)
      }

      ctx.header('Content-Type', 'image/png')
      ctx.header('Cache-Control', 'public, max-age=60')

      return ctx.json({ data: url }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })