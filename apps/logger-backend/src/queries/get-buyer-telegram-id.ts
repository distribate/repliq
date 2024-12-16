import { authDB } from '@repo/shared/db/auth-db';

export async function getBuyerTelegramId(nickname: string) {
  const result = await authDB
  .selectFrom('SOCIAL')
  .select('TELEGRAM_ID')
  .where('LOWERCASENICKNAME', '=', nickname)
  .executeTakeFirst()
  
  return result?.TELEGRAM_ID ?? null;
}