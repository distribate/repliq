export type Comment = {
  id: number;
  created_at: string;
  user_nickname: string;
  content: string;
  updated_at: string | null;
  is_updated: boolean;
}

export type CommentWithReplies = Comment & {
  replied: Comment | null
};

export type GetThreadCommentsResponse = {
  data: CommentWithReplies[],
  meta: {
    hasNextPage: boolean,
    hasNextPrev: boolean,
    startCursor: string | undefined,
    endCursor: string | undefined
  }
}