import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema.ts";
import { z } from "zod";
import { Value } from "@udecode/plate";

export const THREAD_FORM_QUERY = createQueryKey("ui", ["create-thread-form"]);

export type ThreadFormQuery = Omit<z.infer<typeof createThreadSchema>,
  | "content"
  | "images"
  | "category_id"
  | "tags"
  | "visibility"
> & {
  content: Value
  images: string[] | null
  tags: string[] | null
  visibility: "all" | "friends"
  category_id: number | null
};

const initial: ThreadFormQuery = {
  permission: false,
  is_comments: true,
  visibility: "all",
  title: "",
  tags: null,
  content: [],
  category_id: null,
  description: null,
  images: null
};

export const threadFormQuery = () => useQuery<ThreadFormQuery, Error>({
  queryKey: THREAD_FORM_QUERY,
  staleTime: Infinity,
  gcTime: Infinity,
  initialData: initial,
  refetchOnWindowFocus: false,
});