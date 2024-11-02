'use server';

import 'server-only';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ExtendedUserEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import { getUserDonate } from '#user/components/donate/queries/get-user-donate.ts';

export type ExtendedUsers = Pick<ExtendedUserEntity, "id"
  | "nickname"
  | "uuid"
  | "created_at"
  | "name_color"
  | "description"
  | "donate"
>

type Users = Pick<UserEntity, 'id'
  | 'nickname' | 'name_color' | 'uuid' | 'created_at' | 'description'
>

export type GetUsers = {
  range?: number[],
  limit?: number,
  withDonate?: boolean
}

export async function getUsers(filter?: GetUsers): Promise<{
  data: ExtendedUsers[] | Users[], count: number
} | null> {
  const api = createClient();
  
  let query = api
  .from('users')
  .select('id, nickname, uuid, created_at, name_color, description', { count: 'exact' })
  .returns<Users[]>();
  
  if (filter?.range) query.range(filter?.range[0], filter?.range[1]);
  if (filter?.limit) query.limit(filter?.limit);
  
  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  let users: ExtendedUsers[] | Users[];
  
  if (filter?.withDonate) {
    users = await Promise.all(data.map(async (user) => {
      const donate = await getUserDonate(user.nickname);
      return { ...user, donate };
    }));
  } else {
    users = data;
  }
  
  return {
    data: users,
    count: count ? count : 0,
  };
}