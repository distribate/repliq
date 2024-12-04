"use server";

import { UpdateThreadRatingType } from "./post-thread-rating.ts";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import {
  ThreadEntity,
  ThreadRatingEntity,
} from "@repo/types/entities/entities-type.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export type ThreadRatingResponse = {
  increment: number;
  decrement: number;
  currentType: UpdateThreadRatingType;
};

export async function getThreadRating(
  threadId?: Pick<ThreadEntity, "id">["id"],
): Promise<ThreadRatingResponse | null> {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser || !threadId) return null;

  const api = createClient();

  const { data: currentUserRatingType } = await api
    .from("threads_rating")
    .select("type")
    .eq("thread_id", threadId)
    .eq("user_id", currentUser?.id)
    .single();

  const { data: currentRating } = await api
    .from("threads_rating")
    .select("*")
    .eq("thread_id", threadId)
    .returns<ThreadRatingEntity[]>();

  return {
    increment:
      currentRating?.filter((item) => item.type === "increment").length || 0,
    decrement:
      currentRating?.filter((item) => item.type === "decrement").length || 0,
    currentType: currentUserRatingType?.type as UpdateThreadRatingType,
  };
}
