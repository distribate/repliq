import { useQuery } from '@tanstack/react-query';
import { getThreadsImages } from '../../queries/get-thread-images.ts';

const THREAD_IMAGES_QUERY_KEY = (thread_id: string) => ["ui", "thread-images", thread_id]

export const threadImagesQuery = (thread_id: string) => {
  return useQuery({
    queryFn: () => getThreadsImages({ thread_id }),
    queryKey: THREAD_IMAGES_QUERY_KEY(thread_id),
    retry: 1,
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity
  })
}