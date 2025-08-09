export type ThreadOwner = {
  nickname: string;
  name_color: string | null;
  avatar: string | null
}

export type ThreadDetailed = {
  id: string;
  title: string;
  created_at: string;
  content: any;
  category_id: number,
  description: string | null;
  updated_at: string | null;
  tags: Array<string>;
  views_count: number;
  comments_count: number;
  images: string[],
  owner: ThreadOwner,
  properties: {
    is_comments: boolean;
    is_updated: boolean;
    //
    is_saved?: boolean
  }
}

export type ThreadPreview = {
  id: string;
  title: string;
  created_at: string;
  description: string | null;
  comments_count: number;
  views_count: number;
  owner: ThreadOwner;
  properties: {
    is_comments: boolean;
  },
};