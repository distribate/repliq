import { forumDB } from "../../shared/database/forum-db";

type ValidateExistsUser = {
  withCredentials?: boolean;
  nickname: string;
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
    const credentials = await getCredentials(query.id)

    if (!credentials) {
      return { result: false, data: null }
    }

    return { result: true, data: { ...credentials, ...query } }
  }

  return { result: Boolean(query), data: null }
}