import { forumDB } from "#shared/database/forum-db.ts"

export async function validateAdmin(nickname: string): Promise<boolean> {
  const exists = await forumDB
    .selectFrom("admins")
    .select("nickname")
    .where("nickname", "=", nickname)
    .executeTakeFirst()
    
  return !!exists
}