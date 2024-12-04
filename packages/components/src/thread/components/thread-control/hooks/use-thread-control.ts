import { useMutation, useQueryClient } from "@tanstack/react-query";
import { THREAD_RATING_QUERY_KEY } from "../../thread-bump/queries/thread-rating-query.ts";
import { updateThread } from "../queries/update-thread-fields.ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CURRENT_THREAD_QUERY_KEY } from "../queries/current-thread-query.ts";
import { revalidatePath } from "next/cache";
import {
  THREAD_CONTROL_QUERY_KEY,
  ThreadControlQuery,
  ThreadControlQueryValues,
} from "#thread/components/thread-control/queries/thread-control-query.ts";
import { removeThread } from "#thread/components/thread-control/queries/remove-thread.ts";

export const THREAD_CONTROL_MUTATION_KEY = ["thread-control-update"];

export const useThreadControl = () => {
  const qc = useQueryClient();
  const { replace, refresh } = useRouter();

  const setThreadNewValuesMutation = useMutation({
    mutationFn: async (values: ThreadControlQuery) => {
      return qc.setQueryData(
        THREAD_CONTROL_QUERY_KEY,
        (prev: ThreadControlQuery) => ({
          state: { ...prev.state, ...values.state },
          values: { ...prev.values, ...values.values },
        }),
      );
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const updateThreadMutation = useMutation({
    mutationKey: THREAD_CONTROL_MUTATION_KEY,
    mutationFn: async (threadId: string) => {
      const newData = qc.getQueryData<ThreadControlQuery>(
        THREAD_CONTROL_QUERY_KEY,
      )?.values;
      if (!newData) return "no-update-fields";

      const values: ThreadControlQueryValues = Object.fromEntries(
        Object.entries(newData).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      ) as ThreadControlQueryValues;

      return updateThread({ threadId, values });
    },
    onSettled: refresh,
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка при обновлении");
      if (data === "no-update-fields")
        return toast.info("Ничего не было обновлено");

      qc.invalidateQueries({ queryKey: CURRENT_THREAD_QUERY_KEY(variables) });
      qc.invalidateQueries({ queryKey: THREAD_RATING_QUERY_KEY(variables) });
      qc.resetQueries({ queryKey: THREAD_CONTROL_QUERY_KEY });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const removeThreadMutation = useMutation({
    mutationKey: THREAD_CONTROL_MUTATION_KEY,
    mutationFn: async (threadId: string) => removeThread({ id: threadId }),
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка при удалении треда");

      await Promise.all([
        qc.resetQueries({ queryKey: CURRENT_THREAD_QUERY_KEY(variables) }),
        qc.resetQueries({ queryKey: THREAD_RATING_QUERY_KEY(variables) }),
      ]);

      replace("/");
      return revalidatePath("/");
    },
  });

  return {
    updateThreadMutation,
    removeThreadMutation,
    setThreadNewValuesMutation,
  };
};
