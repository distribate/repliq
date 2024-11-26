'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { SearchTypes } from '../types/search-types.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { SearchPageQuery } from '#search/queries/search-page-query.ts';

type GetSearchThreads = Omit<SearchTypes, 'searchedValue'> & {
  searchedValue: string
} & Pick<SearchPageQuery, "type">

type SearchedThread = Pick<ThreadEntity, "id" | "title">

export async function getSearchThreads({
  searchedValue, range, limit, type
}: GetSearchThreads) {
  const api = createClient();
  
  const buildQuery = () => {
    const query = type === 'title'
      ? api
      .from('threads')
      .select('title, id')
      .ilike('title', `%${searchedValue}%`)
      : api
      .from('threads_users')
      .select('thread_id, threads(title, id)')
      .eq('user_nickname', searchedValue);
    
    if (limit) query.limit(limit);
    if (range && range.length === 2) query.range(range[0], range[1]);
    return query;
  };
  
  const { data, error } = await buildQuery();
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (type === 'title') {
    return data as Array<SearchedThread>;
  }
  
  return (data as { thread_id: string, threads: Array<SearchedThread> }[])
    .flatMap(item => item.threads) as SearchedThread[];
}