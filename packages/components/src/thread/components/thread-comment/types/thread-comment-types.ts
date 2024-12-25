export type ThreadCommentProps = {
  nickname: string;
  isAuthor: boolean;
  id: number;
  created_at: string;
  thread_id: string;
  content: string;
  edited: boolean;
  replied: {
    id: string;
    user_nickname: string;
    content: string;
  } | null;
};
