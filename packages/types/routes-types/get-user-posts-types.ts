import type { Posts } from '../db/forum-database-types.ts';
import type { Selectable } from 'kysely';

export type UserPostItem = Selectable<Posts> & {
  comments_count: number;
  views_count: number;
  isViewed: boolean;
  user_nickname: string;
  views: Array<string>
}

export type GetUserPostsResponse = {
  data: Array<UserPostItem>;
  meta: {
    count: number
  }
}