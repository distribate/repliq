"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';
import { getThreadModel, ThreadModel } from '#thread/queries/get-thread-model.ts';

export type RequestProperties = {
  range: number[],
  limit: number,
}

export type GetCategoryThreads = {
  categoryId: string
} & Partial<RequestProperties>

export async function getCategoryThreads({
  categoryId, range, limit = 12
}: GetCategoryThreads): Promise<ThreadModel[] | null> {
  const api = createClient()
  
  let threads: ThreadModel[] | null = null;
  
  let query = api
  .from("category_threads")
  .select("category_id, thread_id, threads(id)")
  .eq("category_id", categoryId)
  
  if (range) query.range(range[0], range[1])
  if (limit) query.limit(limit)
  
  const { data, error } = await query;
  
  if (error) throw new Error(error.message)
  
  const mappedThreads = data.flatMap(item => item.threads)
  
  threads = [];
  
  for (let i = 0; i < mappedThreads.length; i++) {
    const thread = mappedThreads[i];
    
    const threadModel = await getThreadModel({
      threadId: thread.id, withViews: false
    })
    
    if (!threadModel) return threads
    
    threads.push(threadModel)
  }
  
  return threads;
}