import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { THREAD_REACTIONS_QUERY_KEY } from "../queries/thread-reactions-query.ts";
import { addReactionToThread, UpdateThreadRating } from "#components/thread/queries/add-reaction-to-thread.ts";

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