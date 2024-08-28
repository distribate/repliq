import { USER } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts';

type GetLastUsers = Pick<USER, 'nickname'
  | 'created_at'
  | 'name_color'
  | 'description'
>

export async function getLastUsers(): Promise<GetLastUsers[] | null> {
  const supabase = createClient();
  
  let users: GetLastUsers[] | null = [];
  
  const { data, error } = await supabase
  .from('users')
  .select(`
		nickname,
		description,
	  created_at,
	  name_color
	`)
  .range(0, 6)
  .limit(6)
  .order('created_at', {
    ascending: false,
  });
  
  if (error) throw error;
  if (!data.length) return null;
  
  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const banStatus = await getUserBanned(user.nickname);
    
    if (!banStatus || banStatus.nickname !== user.nickname)
      users?.push(user);
  }

  return users;
}