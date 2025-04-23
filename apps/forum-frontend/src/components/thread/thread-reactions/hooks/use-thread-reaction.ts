import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { THREAD_REACTIONS_QUERY_KEY } from "../queries/thread-reactions-query.ts";
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

const THREAD_RATING_MESSAGES: Record<string, string> = {
  "Reacted": "Вы уже оценивали тред",
  "Created": "Вы оценили тред",
  "Deleted": "Вы удалили оценку треда",
  "Limit exceeded": ""
}

export const useThreadReaction = () => {
  const qc = useQueryClient();

  const addReactionToThreadMutation = useMutation({
    mutationFn: async (values: UpdateThreadRating) => addReactionToThread(values),
    onSuccess: async (data, variables) => {
      if (!data) return null;

      if ("error" in data) {
        const { error } = data;

        return toast.error(THREAD_RATING_MESSAGES[error] ?? "Что-то пошло не так")
      }

      return qc.invalidateQueries({
        queryKey: THREAD_REACTIONS_QUERY_KEY(variables.id),
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { addReactionToThreadMutation };
};