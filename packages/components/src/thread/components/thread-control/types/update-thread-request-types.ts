import { ThreadControl } from '../hooks/use-thread-control.ts';

export type UpdateThreadFields = ThreadControl & Partial<{
  field: {
    [key: string]: string | boolean | null;
  };
}>