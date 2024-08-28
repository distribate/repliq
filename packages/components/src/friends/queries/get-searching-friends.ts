"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { getUsers } from '../../admin/components/dashboard/queries/get-users.ts';
import { getFriends } from './get-friends.ts';

export async function getSearchingFriends() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;
  
  const [users, friends ] = await Promise.all([
    getUsers(),
    getFriends({
      nickname: currentUser.nickname
    })
  ])
  
  if (!users) return null;
  if (!friends) return users.filter(
    u => u.nickname !== currentUser.nickname
  );
  
  const searchingFriends = users.filter(u =>
    u.nickname !== currentUser.nickname
     && !friends.some(
       friend => friend.nickname === u.nickname
      )
  );

  return searchingFriends;
}