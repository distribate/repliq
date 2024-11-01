export type ThreadRequest = {
  thread_id?: string,
};

export type ThreadRequestType = 'only_thread'
  | 'with_comments'
  | 'all'
  | 'with_images'
  | "page"