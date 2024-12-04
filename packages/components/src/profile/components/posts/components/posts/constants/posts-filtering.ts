import { PostsFilteringQuery } from "#profile/components/posts/components/posts/queries/posts-filtering-query.ts";

export type PostSort = {
  title: string;
  value: Pick<PostsFilteringQuery, "filteringType">["filteringType"];
};

export const POSTS_SORT: PostSort[] = [
  { title: "По дате публикации", value: "created_at" },
  { title: "По кол-ву просмотров", value: "views" },
];
