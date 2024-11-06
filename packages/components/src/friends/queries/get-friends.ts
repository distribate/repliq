'use server';

import "server-only"
import type { FriendsSort } from '#profile/components/friends/hooks/use-friends-sort.tsx';
import { createClient } from "@repo/lib/utils/api/server.ts";
import { FriendEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import { getNotedFriends } from '#friends/queries/get-noted-friends.ts';
import { getPinnedFriends } from '#friends/queries/get-pinned-friends.ts';

export type RequestFriends = Pick<UserEntity, "nickname"> & Partial<{
  orderType: FriendsSort,
  ascending: boolean
}>

type FriendDetails = {
  friend_id: string,
  created_at: string,
  isPinned: boolean,
  note: string | null
}

export type UserFriends = FriendDetails
  & Pick<UserEntity, "nickname" | "status" | "description" | "real_name" | "name_color">

export async function getFriends({
  nickname, orderType, ascending = false
}: RequestFriends): Promise<UserFriends[] | null> {
  const api = createClient();
  
  let friendsQuery = api
  .from('users_friends')
  .select(`id, user_1, user_2, created_at`)
  .or(`user_1.eq.${nickname},user_2.eq.${nickname}`)
  .returns<FriendEntity[]>()
  
  if (ascending && orderType) {
    friendsQuery = friendsQuery.order(orderType, { ascending });
  }
  
  const { data: friendsData, error: friendsError } = await friendsQuery
  
  if (friendsError) {
    throw new Error(`Error fetching friends: ${friendsError.message}`);
  }
  
  if (!friendsData) return null;
  
  const [pinnedFriends, notedFriends] = await Promise.all([
    getPinnedFriends(),
    getNotedFriends()
  ])
  
  const friendNicknames = new Set<string>();
  
  friendsData.forEach(({ user_1, user_2 }) => {
    if (user_1 !== nickname) friendNicknames.add(user_1);
    if (user_2 !== nickname) friendNicknames.add(user_2);
  });
  
  let usersQuery = api
  .from('users')
  .select(`nickname, description, status, name_color, real_name`)
  .in('nickname', Array.from(friendNicknames))
  .returns<UserFriends[]>();
  
  const { data: friendsDetails, error: userError } = await usersQuery;
  
  if (userError) {
    throw new Error(`Error fetching user details: ${userError.message}`);
  }
  
  const friends = friendsData.map(friend => {
    const friendNickname = friend.user_1 === nickname
      ? friend.user_2 : friend.user_1;
    
    const friendDetails = friendsDetails.find(
      fd => fd.nickname === friendNickname,
    );
    
    if (!friendDetails) return null;
    
    const isPinned = pinnedFriends
      ? pinnedFriends.some(
        pinned => pinned.recipient === friendNickname
      )
      : false;
    
    const noted = notedFriends
      ? notedFriends.find(
        noted => noted.recipient === friendNickname
      ) : null
    
    return {
      friend_id: friend.id,
      created_at: friend.created_at,
      nickname: friendDetails.nickname,
      description: friendDetails.description,
      status: friendDetails.status,
      name_color: friendDetails.name_color,
      isPinned: isPinned,
      note: noted ? noted.note : null,
      real_name: friendDetails.real_name,
    };
  }).filter(
    (friend): friend is UserFriends => friend !== null,
  ); // Filter out null values
  
  if (friends.length === 0) {
    return null;
  }
  
  return friends;
}