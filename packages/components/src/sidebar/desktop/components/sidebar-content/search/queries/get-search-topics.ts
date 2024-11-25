'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { SearchTypes } from '../types/search-types.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

type GetSearchThreads = {
  user: string | null
} & Omit<SearchTypes, 'searchedValue'> & {
  searchedValue: string | null
}

type SearchedThread = Pick<ThreadEntity, "id" | "title">

export async function getSearchThreads({
  searchedValue, range, limit,  user,
}: GetSearchThreads) {
  if (!searchedValue && !user) return [];
  
  const api = createClient();
  
  const buildQuery = () => {
    const query = !!user
      ? api
      .from('threads')
      .select('title, id')
      .ilike('title', `%${searchedValue}%`)
      : api
      .from('threads_users')
      .select('thread_id, threads(title, id)')
      .eq('user_nickname', user);
    
    if (limit) query.limit(limit);
    if (range && range.length === 2) query.range(range[0], range[1]);
    return query;
  };
  
  const { data, error } = await buildQuery();
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!!user) {
    return data as Array<SearchedThread>;
  }
  
  return (data as { thread_id: string, threads: Array<SearchedThread> }[])
    .flatMap(item => item.threads) as SearchedThread[];
}