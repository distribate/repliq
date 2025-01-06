import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateThreadRating,
  updateThreadRating,
} from "../../../queries/post-thread-rating.ts";
import { toast } from "sonner";
import { THREAD_REACTIONS_QUERY_KEY } from "../queries/thread-reactions-query.ts";

const THREAD_RATING_MESSAGES: Record<string, string> = {
  "Reacted": "Вы уже оценивали тред",
  "Created": "Вы оценили тред",
  "Deleted": "Вы удалили оценку треда",
  "Limit exceeded": ""
}

export const useThreadReaction = () => {
  const qc = useQueryClient();

  const updateThreadRatingMutation = useMutation({
    mutationFn: async (values: UpdateThreadRating) => updateThreadRating(values),
    onSuccess: async (data, variables) => {
      if (!data) return null;

      if ("error" in data) {
        const { error } = data;

        return toast.error(THREAD_RATING_MESSAGES[error] ?? "Что-то пошло не так")
      } else {
        const { status } = data;

        if (status === "Limit exceeded") {

        } else {
          // toast.success(THREAD_RATING_MESSAGES[status]);
        }
      }

      return qc.invalidateQueries({
        queryKey: THREAD_REACTIONS_QUERY_KEY(variables.threadId),
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { updateThreadRatingMutation };
};