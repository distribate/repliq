import { forumDB } from "#shared/database/forum-db.ts";
import type { LuckpermsLogContent } from "#subscribers/sub-player-group.ts";

export async function createUserActionLog({
  target: { name: target_nickname, type, uniqueId: uuid },
  source: { name: source_nickname },
  description
}: LuckpermsLogContent) {
  return await forumDB
    .insertInto("users_actions")
    .values({ target_nickname, source_nickname, uuid, type, description })
    .executeTakeFirst();
}