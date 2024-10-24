import { ThreadModel } from '../../../queries/get-thread-model.ts';

export type ThreadControlProps = Pick<ThreadModel, "title" | "id" | "description" | "comments" | "content">
