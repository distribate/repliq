import { forumThreadClient } from "@repo/shared/api/forum-client";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";

export type UpdateThreadRatingType = "increment" | "decrement";

export type UpdateThreadRating = {
  emoji: string;
  threadId: Pick<ThreadEntity, "id">["id"];
};

export async function updateThreadRating({
  emoji, threadId
}: UpdateThreadRating) {
  const createReaction = await forumThreadClient.thread["create-thread-reaction"][":threadId"].$post({
    json: {
      emoji,
    },
    param: {
      threadId
    }
  });

  const createReactionData = await createReaction.json();

  console.log(createReactionData);

  return createReactionData
}