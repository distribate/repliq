'use server';

import { ReportEntity } from '@repo/types/entities/entities-type';
import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

type PostReportType = Omit<ReportEntity, 'id'
  | 'created_at'
  | 'reported_item'
  | 'user_nickname'
  | 'target_user_nickname'
> & PostReportItem

export type PostReportItem = {
  targetId: string | number,
  targetNickname: string,
  targetContent: string | null
}

export async function postReport({
  report_type, reason, targetContent, targetNickname, targetId,
}: PostReportType) {
  const { user } = await getCurrentSession();
  if (!user) return;
  
  let reported_item: PostReportItem | null = null;
  
  if (!targetNickname || !targetId) return;
  if (user.nickname === targetNickname) return;
  
  reported_item = {
    targetId, targetContent, targetNickname,
  };
  
  const api = createClient();
  
  const { data, error } = await api
  .from('reports')
  .insert({
    reason,
    reported_item,
    target_user_nickname: targetNickname,
    report_type,
    user_nickname: user.nickname,
  })
  .select()
  .returns<ReportEntity>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}