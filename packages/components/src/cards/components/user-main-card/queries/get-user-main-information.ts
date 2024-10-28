'use server';

import "server-only"
import { getRequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getFavoriteItem } from '@repo/lib/queries/get-favorite-item.ts';
import { UserMainCard } from '../types/user-main-card-types.ts';
import { UserCardQuery } from './user-main-card-query.ts';
import { getUserTimeFromServer } from '@repo/lib/queries/get-user-time-from-server.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

async function getFriendsCount({
  nickname
}: UserMainCard): Promise<number> {
  const api = createClient();
  
  const { count, error } = await api
  .from('users_friends')
  .select('*', { count: 'exact' })
  .or(`user_1.eq.${nickname},user_2.eq.${nickname}`)
  
  if (error) {
    throw new Error(error.message);
  }
  
  return count ?? 0;
}

async function getThreadsCount({
  nickname,
}: UserMainCard): Promise<number> {
  const api = createClient();
  
  const { count, error } = await api
  .from('threads_users')
  .select('*', { count: 'exact' })
  .eq('user_nickname', nickname);
  
  if (error) throw new Error(error.message);
  
  return count ?? 0;
}

async function getStats({
  nickname
}: UserMainCard): Promise<Pick<UserCardQuery, "stats">["stats"]> {
  const [threadsCount, friendsCount, joined] = await Promise.all([
    getThreadsCount({ nickname }),
    getFriendsCount({ nickname }),
    getUserTimeFromServer(nickname)
  ])
  
  return { friendsCount, threadsCount, joined }
}

export async function getUserMainInformation({
  nickname
}: UserMainCard): Promise<UserCardQuery | null> {
  const [ user, stats ] = await Promise.all([
    getRequestedUser(nickname),
    getStats({ nickname }),
  ]);
  
  if (typeof user === 'string') return null;
  
  const item = await getFavoriteItem({
    favorite_item: user.favorite_item
  })
  
  return {
    user,
    favoriteItem: item,
    stats: { ...stats }
  };
}