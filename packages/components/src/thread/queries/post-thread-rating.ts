"use server";

import { createClient } from '@repo/shared/api/supabase-client.ts';
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export type UpdateThreadRatingType = "increment" | "decrement";

export type UpdateThreadRating = {
  type: UpdateThreadRatingType;
  threadId: Pick<ThreadEntity, "id">["id"];
};

type UpdateThreadRatingError = "alreadyRating" | "default";

type RatingType = {
  threadId: string;
  currentUserId: string;
};

type PostRating = RatingType & UpdateThreadRating;

async function deleteDecrementRating({ currentUserId, threadId }: RatingType) {
  const api = createClient();

  const { error } = await api
    .from("threads_rating")
    .delete()
    .eq("thread_id", threadId)
    .eq("user_id", currentUserId)
    .eq("type", "decrement");

  if (error) {
    throw new Error(error.message);
  }
}

async function deleteIncrementRating({ currentUserId, threadId }: RatingType) {
  const api = createClient();

  const { error } = await api
    .from("threads_rating")
    .delete()
    .eq("thread_id", threadId)
    .eq("user_id", currentUserId)
    .eq("type", "increment");

  if (error) {
    throw new Error(error.message);
  }
}

async function postRating({ currentUserId, threadId, type }: PostRating) {
  const api = createClient();

  const {
    data: threadsRating,
    error: threadsRatingsErr,
    statusText,
  } = await api
    .from("threads_rating")
    .insert({
      thread_id: threadId,
      user_id: currentUserId,
      type: type,
    })
    .select()
    .single();

  if (threadsRatingsErr || statusText === "Conflict") {
    const { error: threadsRatingsErr } = await api
      .from("threads_rating")
      .delete()
      .eq("thread_id", threadId)
      .eq("user_id", currentUserId)
      .eq("type", type);

    if (threadsRatingsErr) return "default";

    return true;
  }

  return threadsRating && !threadsRatingsErr;
}

export async function updateThreadRating({
  type,
  threadId,
}: UpdateThreadRating): Promise<boolean | UpdateThreadRatingError> {
  const { user: currentUser } = await getCurrentSession();

  if (!currentUser || !threadId) return "default";

  switch (type) {
    case "increment":
      await deleteDecrementRating({
        currentUserId: currentUser.id,
        threadId: threadId,
      });
      break;
    case "decrement":
      await deleteIncrementRating({
        threadId: threadId,
        currentUserId: currentUser.id,
      });
      break;
  }

  return postRating({
    type,
    currentUserId: currentUser.id,
    threadId: threadId,
  });
}
