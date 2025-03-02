import { useMutation, useQueryClient } from "@tanstack/react-query";
import { THREAD_REACTIONS_QUERY_KEY } from "../../thread-reactions/queries/thread-reactions-query.ts";
import { updateThread } from "../queries/update-thread-fields.ts";
import { toast } from "sonner";
import { useRouter, useNavigate } from "@tanstack/react-router";
import {
  THREAD_CONTROL_QUERY_KEY,
  ThreadControlQuery,
  ThreadControlQueryValues,
} from "#components/thread/components/thread-control/queries/thread-control-query.ts";
import { removeThread } from "#components/thread/components/thread-control/queries/remove-thread.ts";
import { THREAD_QUERY_KEY } from "#components/thread/components/thread-main/queries/thread-query.ts";
import { MAIN_CATEGORIES_QUERY_KEY } from "#components/categories/components/main-categories-list.tsx";

export const THREAD_CONTROL_MUTATION_KEY = ["thread-control-update"];

export const useThreadControl = () => {
  const qc = useQueryClient();
  const { invalidate } = useRouter();
  const navigate = useNavigate()

  const setThreadNewValuesMutation = useMutation({
    mutationFn: async (values: Partial<ThreadControlQuery>) => {
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
    onSettled: () => invalidate(),
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка при обновлении");
      if (data === "no-update-fields")
        return toast.info("Ничего не было обновлено");

      await Promise.all([
        qc.invalidateQueries({ queryKey: THREAD_QUERY_KEY(variables) }),
        qc.invalidateQueries({ queryKey: THREAD_REACTIONS_QUERY_KEY(variables) }),
        qc.resetQueries({ queryKey: THREAD_CONTROL_QUERY_KEY })
      ])
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const removeThreadMutation = useMutation({
    mutationKey: THREAD_CONTROL_MUTATION_KEY,
    mutationFn: async (threadId: string) => removeThread(threadId),
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка при удалении треда");

      await Promise.all([
        qc.resetQueries({ queryKey: THREAD_QUERY_KEY(variables) }),
        qc.resetQueries({ queryKey: THREAD_REACTIONS_QUERY_KEY(variables) }),
      ]);

      await qc.invalidateQueries({ queryKey: MAIN_CATEGORIES_QUERY_KEY })
      await navigate({ to: "/" });
    },
  });

  return {
    updateThreadMutation,
    removeThreadMutation,
    setThreadNewValuesMutation,
  };
};
