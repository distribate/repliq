import { RequestDetails, UserEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from '../../../../../lib/utils/api/supabase-client.ts';
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts';

type GetLastUsers = Pick<UserEntity,
  | 'nickname' | 'created_at' | 'name_color' | 'description'
>

export async function getLastUsers(filter?: RequestDetails): Promise<GetLastUsers[] | null> {
  const api = createClient();
  
  let users: GetLastUsers[] | null = null;
  
  let query = api
  .from('users')
  .select(`
    nickname, description, created_at, name_color
  `)
  .order('created_at', { ascending: false });
  
  if (filter?.limit) query.limit(filter.limit);
  if (filter?.range) query.range(filter.range[0], filter.range[1]);
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(error.message);
  }

  users = []
  
  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const banStatus = await getUserBanned(user.nickname);
    
    if (!banStatus || banStatus.nickname !== user.nickname) {
      users.push(user);
    }
  }

  return users;
}