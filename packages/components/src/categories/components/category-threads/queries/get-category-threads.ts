"use server";

import { createClient } from '@repo/shared/api/supabase-client.ts';
import {
  getThreadModel,
  ThreadModel,
} from "#thread/queries/get-thread-model.ts";
import { RequestDetails } from "@repo/types/entities/entities-type.ts";

export type GetCategoryThreads = {
  category_id: string;
} & Partial<RequestDetails>;

export async function getCategoryThreads({
  category_id,
  range,
  limit = 12,
}: GetCategoryThreads): Promise<ThreadModel[] | null> {
  const api = createClient();

  let threads: ThreadModel[] | null = null;

  let query = api
    .from("category_threads")
    .select("category_id, thread_id, threads(id)")
    .eq("category_id", category_id);

  if (range) query.range(range[0], range[1]);
  if (limit) query.limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const mappedThreads = data.flatMap((item) => item.threads);

  threads = [];

  for (let i = 0; i < mappedThreads.length; i++) {
    const thread = mappedThreads[i];
    const threadModel = await getThreadModel({ id: thread.id });

    if (!threadModel) return threads;

    threads.push(threadModel);
  }

  return threads;
}
