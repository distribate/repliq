import { ThreadModel } from '../../../queries/get-thread-model.ts';

export type ThreadControlFields = Pick<ThreadModel, "title" | "id" | "description" | "isComments" | "content">