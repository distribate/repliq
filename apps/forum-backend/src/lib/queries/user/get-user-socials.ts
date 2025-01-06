import { authDB } from "#shared/database/auth-db.ts";

export async function getUserSocials(nickname: string) {
  return await authDB
    .selectFrom("SOCIAL")
    .select([
      "DISCORD_ID",
      "TELEGRAM_ID",
    ])
    .where("LOWERCASENICKNAME", "=", nickname)
    .executeTakeFirst()
}