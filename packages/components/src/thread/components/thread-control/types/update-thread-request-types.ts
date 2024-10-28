import { ThreadControl } from '../hooks/use-thread-control.ts';
import { ThreadRequest } from '../../../types/thread-request-types.ts';

export type UpdateThreadFields = ThreadControl & Partial<{
  field: {
    [key: string]: string | boolean | null;
  };
}>

export type UpdateThreadRequestType = ThreadRequest