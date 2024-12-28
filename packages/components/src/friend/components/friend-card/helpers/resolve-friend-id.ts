import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";

export function resolveFriendId(
  friends: FriendWithDetails[],
  reqUserNickname: string,
) {
  return friends.find((fd) => fd.nickname === reqUserNickname) || null;
}
