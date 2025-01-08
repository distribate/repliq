import { ThreadEntity } from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from '@repo/shared/api/forum-client.ts';

export type UserThreads = Pick<ThreadEntity, "id" | "title" | "created_at"> & {
  comments_count: number;
};

type GetThreadsUser = {
  nickname: string;
  querySearch?: string;
};

export async function getThreadsUser({
  nickname, querySearch,
}: GetThreadsUser) {
  const res = await forumUserClient().user["get-user-threads"][":nickname"].$get({
    param: { nickname },
    query: { querySearch }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.length ? data : null
}