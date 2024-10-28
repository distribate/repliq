'use server';

import { BanUser } from '../types/ban-user-types.ts';
import { createClient } from "@repo/lib/utils/api/server.ts";
export async function controlBanUser({
  type, nickname, parameters,
}: BanUser) {
  if (!type) return;
  
  const api = createClient();
  
  let query = api.from('users_banned');
  
  switch(type) {
    case 'ban':
      if (!parameters || parameters && !parameters.time) return;
      
      const { data: banUser, error: banUserErr } = await query.insert({
        nickname, time: parameters?.time, reason: parameters.reason
      }).eq('nickname', nickname);
      
      if (banUserErr) throw new Error(banUserErr.message);
      
      return banUser;
    case 'unban':
      const { data: unbanUser, error: unbanUserErr } = await query
      .delete()
      .eq('nickname', nickname);
      
      if (unbanUserErr) throw new Error(unbanUserErr.message);
      
      return unbanUser;
  }
}