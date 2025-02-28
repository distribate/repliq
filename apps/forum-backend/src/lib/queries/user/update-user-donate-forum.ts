import { forumDB } from "#shared/database/forum-db.ts";
import type { DonateVariants } from "@repo/types/db/forum-database-types";

type UpdateUserDonateForum = {
  nickname: string
  donate: DonateVariants
}

export async function updateUserDonateForum({ 
  nickname, donate 
}: UpdateUserDonateForum) {
  const query = await forumDB
    .updateTable("users")
    .set({ donate })
    .where("nickname", "=", nickname)
    .returning("donate")
    .executeTakeFirst()

  if (!query || !query.donate) {
    return;
  }

  return query.donate
}