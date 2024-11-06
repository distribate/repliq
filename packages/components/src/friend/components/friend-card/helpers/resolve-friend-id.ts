import { UserFriends } from '#friends/queries/get-friends.ts';

export function resolveFriendId(friends: UserFriends[], reqUserNickname: string) {
  return friends.find(
    fd => fd.nickname === reqUserNickname,
  ) || null;
}