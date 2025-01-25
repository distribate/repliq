import { DonateVariants } from "@repo/types/db/forum-database-types";
import { forumDB } from "../../shared/database/forum-db";

type UpdateUserDonateForum = {
  nickname: string
  donate: DonateVariants
}

export async function updateUserDonateForum({ nickname, donate }: UpdateUserDonateForum) {
  return await forumDB
    .updateTable("users")
    .set({ donate })
    .where("nickname", "=", nickname)
    .executeTakeFirst()
}