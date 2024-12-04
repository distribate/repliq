"use server";

import "server-only";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import {
  ThreadCommentEntity,
  ThreadEntity,
} from "@repo/types/entities/entities-type.ts";

export type UserThreads = Pick<ThreadEntity, "id" | "title" | "created_at"> & {
  commentsCount: number;
};

type GetThreadsUser = {
  nickname: string;
  querySearch?: string;
};

export async function getThreadsUser({
  nickname,
  querySearch,
}: GetThreadsUser): Promise<UserThreads[] | null> {
  const api = createClient();

  let query = api
    .from("threads_users")
    .select(`thread_id, threads(id,title,created_at)`)
    .eq("user_nickname", nickname);

  if (querySearch) {
    query = query.textSearch("*", `%${querySearch}%`, {
      type: "plain",
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const flatMappedThreads = data.flatMap((item) => item.threads);
  const threadIds = flatMappedThreads.map((thread) => thread.id);

  const commentsCounts = await api
    .from("threads_comments")
    .select("*", { count: "exact" })
    .in("thread_id", threadIds)
    .returns<ThreadCommentEntity[]>();

  if (commentsCounts.error) {
    throw new Error(commentsCounts.error.message);
  }

  const commentsCountMap = commentsCounts.data?.reduce(
    (map, comment) => {
      map[comment.thread_id] = (map[comment.thread_id] || 0) + 1;
      return map;
    },
    {} as Record<string, number>,
  );

  return flatMappedThreads.map((thread) => {
    const commentsCount = commentsCountMap?.[thread.id] ?? 0;
    return { ...thread, commentsCount };
  });
}
