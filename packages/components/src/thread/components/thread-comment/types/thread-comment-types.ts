import { Comment } from "@repo/types/entities/thread-comments-types";

export type ThreadCommentProps = Comment & {
  is_owner: boolean;
  thread_id: string;
  content: string;
  replied: Comment | null;
};