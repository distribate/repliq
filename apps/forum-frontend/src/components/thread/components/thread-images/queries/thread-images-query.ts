import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { getThreadImages } from "./get-thread-images.ts";

export const THREAD_IMAGES_QUERY_KEY = (thread_id: string) =>
  createQueryKey("ui", ["thread-images"], thread_id);

export const threadImagesQuery = (thread_id: string) => useQuery({
  queryKey: THREAD_IMAGES_QUERY_KEY(thread_id),
  queryFn: () => getThreadImages(thread_id),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
});