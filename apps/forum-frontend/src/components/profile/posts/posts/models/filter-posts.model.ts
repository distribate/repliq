import { atom } from '@reatom/core';

export const POSTS_DEFAULT_MAX_RANGE = 8;

export type PostsFilteringQuery = {
  searchQuery?: string;
  filteringType: 'created_at' | 'views_count';
  ascending: boolean;
  cursor?: string
};

const initial: PostsFilteringQuery = {
  filteringType: 'created_at',
  ascending: false,
};

export const postsFilteringAtom = atom<PostsFilteringQuery>(initial, "postsFiltering")