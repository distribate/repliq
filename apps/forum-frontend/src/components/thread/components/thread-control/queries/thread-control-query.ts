import { useSuspenseQuery } from "@tanstack/react-query";
import { Descendant } from "slate";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { ThreadDetailed } from "@repo/types/entities/thread-type";

export const THREAD_CONTROL_QUERY_KEY = createQueryKey("ui", [
  "thread-control-values",
]);

export type ThreadControlQueryValues = Pick<
  ThreadDetailed,
  | "title"
  | "description"
  | "properties"
> & {
  content: Descendant[];
};

export type ThreadControlQuery = {
  state: {
    isValid: boolean;
    isContenteditable: boolean;
  }
  values: Partial<ThreadControlQueryValues> | null;
}

export const threadControlQuery = () => useSuspenseQuery<ThreadControlQuery>({
  queryKey: THREAD_CONTROL_QUERY_KEY,
  gcTime: Infinity,
  initialData: {
    state: {
      isContenteditable: false,
      isValid: false,
    },
    values: null,
  },
  refetchOnWindowFocus: false,
});