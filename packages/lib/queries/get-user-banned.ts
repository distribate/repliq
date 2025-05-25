import { forumUserClient } from "@repo/shared/api/forum-client";
import { BanEntity } from "@repo/types/entities/entities-type.ts";

export type UserBanDetails = Omit<BanEntity, "id" | "created_at">;

export async function getUserBanned(
  nickname: string,
): Promise<UserBanDetails | null> {
  const res = await forumUserClient.user["get-user-ban-details"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if (!data || "error" in data) return null;

  return data.data;
}
