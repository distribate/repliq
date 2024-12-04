"use server";

import { CheckProfileStatus } from "./check-profile-status.ts";
import { getUserBanned, UserBanDetails } from "../queries/get-user-banned.ts";

export async function checkProfileIsBanned(
  nickname: Pick<
    CheckProfileStatus,
    "requestedUserNickname"
  >["requestedUserNickname"],
): Promise<UserBanDetails | null> {
  if (!nickname) return null;

  const result = await getUserBanned(nickname);

  if (!result) return null;

  return result;
}
