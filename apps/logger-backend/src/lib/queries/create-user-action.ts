import { forumDB } from "../../shared/database/forum-db";
import { LuckpermsLogContent } from "../../subscribers/sub-player-group";

export async function createUserAction({
  target: {
    name: target_nickname, type, uniqueId: uuid
  },
  source: {
    name: source_nickname
  },
  description
}: LuckpermsLogContent) {
  return await forumDB
    .insertInto("users_actions")
    .values({ target_nickname, source_nickname, uuid, type, description })
    .execute()
}