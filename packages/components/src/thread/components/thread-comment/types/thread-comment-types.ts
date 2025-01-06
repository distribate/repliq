export type ThreadCommentProps = {
  nickname: string;
  isAuthor: boolean;
  id: number;
  created_at: string;
  thread_id: string;
  content: string;
  edited: boolean;
  replied: {
    id: number;
    user_nickname: string;
    content: string;
    is_updated: boolean;
    updated_at: string | null;
  } | null;
};