import { useQuery } from '@tanstack/react-query';
import { ThreadEntity } from '@repo/types/entities/entities-type';
import { Descendant } from 'slate';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const THREAD_FORM_QUERY = createQueryKey("ui", ["create-thread-form"])

type ThreadFormDetails = Omit<ThreadEntity,
  | 'id' | 'created_at' | 'content' | 'updated_at'
>

export type ThreadFormQuery = Partial<ThreadFormDetails & {
  category_id: number,
  auto_remove_time: string,
  permission_cost: string,
  tags: Array<string> | null,
  content: Descendant[],
  images: Array<string> | null
}>

const initial: ThreadFormQuery = {
  permission: false,
  auto_remove: false,
  isComments: true,
  visibility: 'all'
};

export const threadFormQuery = () => useQuery<
  ThreadFormQuery, Error
>({
  queryKey: THREAD_FORM_QUERY,
  staleTime: Infinity,
  gcTime: Infinity,
  initialData: initial,
  refetchOnWindowFocus: false,
});