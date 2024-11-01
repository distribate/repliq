'use server';

import "server-only"
import { FriendsQuery } from './friends-query.ts';
import type { FriendsSort } from '../../profile/components/friends/hooks/use-friends-sort.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from "@repo/lib/utils/api/server.ts";
import { FriendEntity, FriendNotesEntity, FriendPinnedEntity } from '@repo/types/entities/entities-type.ts';

export type RequestFriends = {
  nickname: string,
  orderType?: FriendsSort,
  ascending?: boolean
}

type FriendDetails = Omit<FriendsQuery, 'friend_id' | 'created_at'>

async function getNotedFriends() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('friends_notes')
  .select()
  .eq('initiator', currentUser.nickname)
  .returns<FriendNotesEntity[]>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

async function getPinnedFriends() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('friends_pinned')
  .select()
  .eq('initiator', currentUser.nickname)
  .returns<FriendPinnedEntity[]>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getFriends({
  nickname, orderType, ascending = false,
}: RequestFriends): Promise<FriendsQuery[] | null> {
  const api = createClient();
  
  const { data: friendsData, error: friendsError } = await api
  .from('users_friends')
  .select(`id, user_1, user_2, created_at`)
  .or(`user_1.eq.${nickname},user_2.eq.${nickname}`)
  .returns<FriendEntity[]>();
  
  const [pinnedFriends, notedFriends] = await Promise.all([
    getPinnedFriends(),
    getNotedFriends()
  ])

  if (friendsError) {
    throw new Error(`Error fetching friends: ${friendsError.message}`);
  }
  
  if (!friendsData) return null;
  
  const friendNicknames = new Set<string>();
  
  friendsData.forEach(({ user_1, user_2 }) => {
    if (user_1 !== nickname) friendNicknames.add(user_1);
    if (user_2 !== nickname) friendNicknames.add(user_2);
  });
  
  let query = api
  .from('users')
  .select(`nickname, description, status, name_color, real_name`)
  .in('nickname', Array.from(friendNicknames))
  .returns<FriendDetails[]>();
  
  const { data: friendsDetails, error: userError } = await query;
  
  if (userError) {
    throw new Error(`Error fetching user details: ${userError.message}`);
  }
  
  const friends = friendsData.map(friend => {
    const friendNickname = friend.user_1 === nickname
      ? friend.user_2
      : friend.user_1;
    
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
    (friend): friend is FriendsQuery => friend !== null,
  ); // Filter out null values
  
  if (friends.length === 0) {
    return null;
  }
  
  return friends;
}