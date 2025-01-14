import { forumDB } from "#shared/database/forum-db.ts"
import { getCurrentTimestamp } from "@repo/lib/helpers/get-current-timestamp"

export async function updateUserStatus(nickname: string, status: boolean) {
  const created_at = getCurrentTimestamp()

  return await forumDB
    .insertInto("users_status")
    .values({ nickname, created_at, status })
    .onConflict((oc) => oc.column("nickname").doUpdateSet({ status, created_at }))
    .execute()
}