import { FriendsQuery } from '#friends/queries/friends-query.ts';

export function resolveFriendId(friends: FriendsQuery[], reqUserNickname: string) {
  return friends.find(
    fd => fd.nickname === reqUserNickname,
  ) || null;
}