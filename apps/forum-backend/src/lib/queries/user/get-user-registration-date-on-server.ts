import { authDB } from "#shared/database/auth-db.ts";

export async function getUserRegistrationDateOnServer(nickname: string) {
  return await authDB
    .selectFrom("AUTH")
    .select("REGDATE")
    .where("NICKNAME", "=", nickname)
    .executeTakeFirst();
}