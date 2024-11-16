import { useQuery } from '@tanstack/react-query';
import { Descendant } from 'slate';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

export const THREAD_CONTROL_QUERY_KEY = [ 'ui', 'thread-control-values' ];

export type ThreadControlQueryValues = Pick<ThreadEntity,
  | 'title'
  | 'description'
  | 'isComments'
  | 'permission'
  | 'auto_remove'
  | 'visibility'
> & {
  content: Descendant[]
}

export type ThreadControlQuery = Partial<{
  state: {
    isContenteditable: boolean,
  },
  values: Partial<ThreadControlQueryValues> | null
}>

export const threadControlQuery = () => useQuery<ThreadControlQuery>({
  queryKey: THREAD_CONTROL_QUERY_KEY,
  gcTime: Infinity,
  initialData: {
    state: { isContenteditable: false },
    values: null
  },
  refetchOnWindowFocus: false,
});