import { forumReactionClient } from "@repo/shared/api/forum-client";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction";
import { z } from "zod";

export type UpdateThreadRating = Omit<z.infer<typeof createReactionSchema>, "type">;

export async function addReactionToThread({
  emoji, id
}: UpdateThreadRating) {
  const createReaction = await forumReactionClient.reaction["create-reaction"].$post({
    json: {
      emoji, id, type: "thread",
    },
  });

  const createReactionData = await createReaction.json();

  return createReactionData
}