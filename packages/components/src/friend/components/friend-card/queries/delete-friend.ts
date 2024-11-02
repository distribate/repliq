'use server';

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from "@repo/lib/utils/api/server.ts";

type DeleteFriend = {
  error: "not-authorized" | null,
  status: number
}

export async function deleteFriend(friend_id: string): Promise<DeleteFriend> {
  const currentUser = await getCurrentUser();

  if (!currentUser) return {
    status: 400, error: 'not-authorized',
  };
  
  const api = createClient();
  
  const { error, status } = await api
  .from('users_friends')
  .delete()
  .eq('id', friend_id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  console.log(status)
  
  return { error: null, status }
}