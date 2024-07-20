'use server';

import { createClient } from '../utils/supabase/server.ts';
import { convertMsToFormattedTimestamp } from '../helpers/convert-ms-to-timestampz-format.ts';

export type UserTimeFromServer = {
  regDate: string,
  loginDate: string
}

export async function getUserTimeFromServer({
  nickname
}: {
  nickname: string
}): Promise<UserTimeFromServer | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('AUTH')
  .select('REGDATE, LOGINDATE')
  .eq('NICKNAME', nickname)
  .single();
  
  if (error) {
    return null;
  }
  
  const regDate = convertMsToFormattedTimestamp(data.REGDATE);
  const loginDate = convertMsToFormattedTimestamp(data.LOGINDATE);
  
  return { regDate, loginDate };
}