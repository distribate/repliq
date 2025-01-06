import { useQuery } from "@tanstack/react-query";
import { getThreadsImages } from "../../queries/get-thread-images.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

const THREAD_IMAGES_QUERY_KEY = (thread_id: string) =>
  createQueryKey("ui", ["thread-images"], thread_id);

export const threadImagesQuery = (thread_id: string) => useQuery({
  queryKey: THREAD_IMAGES_QUERY_KEY(thread_id),
  queryFn: () => getThreadsImages(thread_id),
  refetchOnWindowFocus: false,
});