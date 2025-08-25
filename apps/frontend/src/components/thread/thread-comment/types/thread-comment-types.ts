import { Comment } from "@repo/types/entities/thread-comments-types";

export type ThreadCommentProps = Comment & {
  isOwner: boolean;
  threadId: string;
  content: string;
  replied: Comment | null;
};