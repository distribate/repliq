"use server";

import { getCurrentSession } from "#actions/get-current-session.ts";

export async function protectPrivateArea(
  requestedUserNickname: string,
): Promise<boolean> {
  const { user } = await getCurrentSession();
  if (!user) return false;

  return user.nickname === requestedUserNickname;
}
