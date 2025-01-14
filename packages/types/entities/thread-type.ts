export type ThreadOwner = {
  nickname: string;
  name_color: string | null;
}

export type ThreadDetailed = {
  id: string;
  title: string;
  created_at: string;
  content: any;
  category_id: number,
  description: string | null;
  updated_at: string | null;
  is_comments: boolean;
  is_updated: boolean;
  is_images: boolean;
  threads_tags: Array<string>;
  threads_views_count: number;
  threads_comments_count: number;
  owner: ThreadOwner
}

export type ThreadPreview = {
  id: string;
  title: string;
  created_at: string;
  description: string | null;
  is_comments: boolean;
  thread_comments_count: number;
  thread_views_count: number;
  owner: ThreadOwner
};