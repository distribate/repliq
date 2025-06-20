import { forumDB } from "../../shared/database/forum-db";
import { authDB } from "../../shared/database/auth-db";

type ValidateExistsUser = {
  withCredentials?: boolean;
  nickname: string;
}

async function getOldCredentials(nickname: string) {
  const query = await authDB
    .selectFrom("AUTH")
    .select("HASH")
    .where("NICKNAME", "=", nickname)
    .executeTakeFirst()

  if (!query) return null;

  return query.HASH
}

async function getExistsMinecraftProfile(userId: string) {
  return forumDB
    .selectFrom("users_profiles")
    .innerJoin("minecraft_profiles", "users_profiles.id", "minecraft_profiles.profile_id")
    .select("minecraft_profiles.nickname")
    .where("users_profiles.user_id", "=", userId)
    .executeTakeFirst()
}

async function updateCredentials(userId: string, nickname: string) {
  const existsMinecraftProfile = await getExistsMinecraftProfile(userId)
  if (!existsMinecraftProfile) return;

  const old = await getOldCredentials(nickname)
  if (!old) return;

  const updatedNew = await forumDB
    .insertInto("users_credentials")
    .values({ user_id: userId, hash: old! })
    .returning("hash")
    .executeTakeFirstOrThrow()

  if (!updatedNew) return;

  return updatedNew
}

async function getCredentials(userId: string) {
  return forumDB
    .selectFrom("users_credentials")
    .select("hash")
    .where("user_id", "=", userId)
    .executeTakeFirst()
}

async function getUser(nickname: string) {
  return forumDB
    .selectFrom("users")
    .select(["nickname", "id", "account_status"])
    .where("nickname", "=", nickname)
    .executeTakeFirst()
}

export async function validateExistsUser({ withCredentials = false, nickname }: ValidateExistsUser) {
  const query = await getUser(nickname)

  if (withCredentials && query) {
    let credentials = await getCredentials(query.id)

    if (!credentials) {
      const updatedNew = await updateCredentials(query.id, nickname)
      
      if (!updatedNew) return { result: false, data: null };

      credentials = { hash: updatedNew.hash }
    }

    return { result: true, data: { ...credentials, ...query } }
  }

  return { result: Boolean(query), data: null }
}