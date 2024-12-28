"use server";

import "server-only";
import {
  ThreadEntity,
  UserEntity,
} from "@repo/types/entities/entities-type.ts";
import { getThreadRating, ThreadRatingResponse } from "./get-thread-rating.ts";
import { getThreadCreator } from "./get-thread-creator.ts";
import { createClient } from '@repo/shared/api/supabase-client.ts';
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type ThreadModelDetails = {
  commentsCount: number;
  rating: ThreadRatingResponse | null;
  owner: Pick<UserEntity, "nickname" | "name_color">;
  tags: Array<string> | null;
  views: number | null;
};

export type ThreadModel = ThreadEntity & ThreadModelDetails;

type GetThreadModel = Pick<ThreadEntity, "id"> & {
  postViews?: boolean;
};

async function postThreadView(threadId: string) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  await api.from("threads_views").insert({
    user_id: currentUser.id,
    thread_id: threadId,
  });
}

type Thread = ThreadEntity & {
  threads_tags: Array<{ tags: string[] }>;
  threads_views: Array<{ count: number }>;
  threads_comments: Array<{ count: number }>;
};

async function getThread(
  threadId: Pick<ThreadEntity, "id">["id"],
): Promise<Thread | null> {
  const api = createClient();

  const { data, error } = await api
    .from("threads")
    .select(
      `
    *,
    threads_tags(tags),
    threads_views(count),
    threads_comments(count)
  `,
    )
    .eq("id", threadId)
    .single();

  if (error) return null;

  return {
    ...data,
    threads_tags: data.threads_tags ?? [],
    threads_views: data.threads_views ?? [{ count: 0 }],
    threads_comments: data.threads_comments ?? [{ count: 0 }],
  };
}

export async function getThreadModel({
  id: threadId,
  postViews = false,
}: GetThreadModel): Promise<ThreadModel | null> {
  const [thread, threadCreator, rating] = await Promise.all([
    getThread(threadId),
    getThreadCreator(threadId),
    getThreadRating(threadId),
  ]);

  if (!thread || !threadCreator) return null;

  if (postViews) await postThreadView(threadId);

  return {
    ...thread,
    rating,
    owner: threadCreator,
    tags: thread.threads_tags[0]?.tags || null,
    views: thread.threads_views[0]?.count || 0,
    commentsCount: thread.threads_comments[0]?.count || 0,
  };
}
