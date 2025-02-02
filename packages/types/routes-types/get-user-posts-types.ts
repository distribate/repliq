import type { Posts } from '../db/forum-database-types.ts';
import type { Selectable } from 'kysely';

export type UserPostItem = Omit<Selectable<Posts>, "created_at"> & {
  created_at: string | Date,
  comments_count: number;
  views_count: number;
  isViewed: boolean;
  nickname: string
}

export type GetUserPostsResponse = {
  data: Array<UserPostItem>;
  meta: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startCursor?: string;
    endCursor?: string;
  }
}