import { authDB } from '#lib/db/db.ts';

export async function getBuyerTelegramId(nickname: string) {
  const result = await authDB
  .selectFrom('SOCIAL')
  .select('TELEGRAM_ID')
  .where('LOWERCASENICKNAME', '=', nickname)
  .executeTakeFirst()
  
  return result?.TELEGRAM_ID ?? null;
}