import { forumDB } from "#shared/database/forum-db.ts"
import { getCurrentTimestamp } from "@repo/lib/helpers/get-current-timestamp"

export async function updateUserStatus(nickname: string) {
  const created_at = getCurrentTimestamp()

  return await forumDB
    .insertInto("users_status")
    .values({ nickname, created_at })
    .onConflict((oc) =>
      oc.column("nickname").doUpdateSet({ created_at })
    )
    .execute()
}