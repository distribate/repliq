"use server";

import "server-only";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from '@repo/lib/utils/api/forum-client.ts';

export type UserThreads = Pick<ThreadEntity, "id" | "title" | "created_at"> & {
  commentsCount: number;
};

type GetThreadsUser = {
  nickname: string;
  querySearch?: string;
};

export async function getThreadsUser({
  nickname, querySearch,
}: GetThreadsUser) {
  const res = await forumUserClient.user["get-user-threads"][":nickname"].$get({
    param: { 
      nickname
     },
    query: { 
      querySearch
     }
  })
  
  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  if (data.length ? data : null) return null;
  
  return data;
}