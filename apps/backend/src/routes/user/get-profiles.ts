import { forumDB } from '#shared/database/forum-db.ts';
import { getNickname } from '#lib/modules/context.ts';
import { throwError } from '#utils/throw-error.ts';
import { Hono } from 'hono';

type Integration = 
  | "minecraft"

async function getProfiles(nickname: string) {
  const query = await forumDB
    .selectFrom("users_profiles")
    .leftJoin("users", "users.id", "users_profiles.user_id")
    .innerJoin("minecraft_profiles", "minecraft_profiles.profile_id", "users_profiles.id")
    .select([
      "minecraft_profiles.created_at",
      "minecraft_profiles.uuid",
      "minecraft_profiles.nickname"
    ])
    .where("users.nickname", "=", nickname)
    .executeTakeFirst()

  if (!query) return [];

  const result = [
    { id: "minecraft" as Integration, details: query }
  ]

  return result
}

export const getProfilesRoute = new Hono()
  .get("/profiles", async (ctx) => {
    const nickname = getNickname()

    try {
      const data = await getProfiles(nickname)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })