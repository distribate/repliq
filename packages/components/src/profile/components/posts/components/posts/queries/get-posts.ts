"use server";

import { checkIsFriend } from "@repo/lib/helpers/check-is-friend.ts";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import {
  PostEntity,
  RequestDetails,
} from "@repo/types/entities/entities-type.ts";
import { PostsFilteringQuery } from "#profile/components/posts/components/posts/queries/posts-filtering-query.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export type GetPosts = {
  nickname: string;
} & RequestDetails &
  Partial<PostsFilteringQuery>;

export type OverridedPosts = PostEntity & {
  comments_count: number;
  views_count: number;
  isViewed: boolean;
  user_nickname: string;
};

export type PostsByUser = {
  data: OverridedPosts[];
  meta: { count: number };
};

const friendCheckCache: Record<string, boolean> = {};

const processPost = (
  post: OverridedPosts,
  currentUser: { id: string; nickname: string },
  isFriend: boolean,
) => {
  const { isViewed: raw } = post;

  const isViewed =
    Array.isArray(raw) && raw.some((view) => view.user_id === currentUser.id);

  switch (post.visibility) {
    case "all":
      return { ...post, isViewed };
    case "only":
      return currentUser.nickname === post.user_nickname
        ? { ...post, isViewed }
        : null;
    case "friends":
      return isFriend || currentUser.nickname === post.user_nickname
        ? { ...post, isViewed }
        : null;
    default:
      return null;
  }
};

export async function getPosts({
  nickname,
  limit,
  ascending = false,
  searchQuery,
  filteringType,
  range,
}: GetPosts): Promise<PostsByUser | null> {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser || !nickname) return null;

  const api = createClient();

  const { data: pinnedPost, error: pinnedError } = await api
    .from("posts_with_comments_and_view_counts")
    .select(
      `
    *,
    isViewed: posts_views(user_id)
  `,
    )
    .eq("user_nickname", nickname)
    .eq("isPinned", true)
    .returns<OverridedPosts[]>();

  if (pinnedError) throw new Error(pinnedError.message);

  let query = api
    .from("posts_with_comments_and_view_counts")
    .select(
      `
    *,
    isViewed: posts_views(user_id)
  `,
      { count: "exact" },
    )
    .eq("user_nickname", nickname);

  if (searchQuery) {
    query = query.textSearch("content", searchQuery, { type: "plain" });
  }

  if (filteringType) {
    query = query.order(
      filteringType === "created_at" ? "created_at" : "views_count",
      { ascending },
    );
  }

  if (range) query = query.range(range[0], range[1]);
  if (limit) query = query.limit(limit);

  const {
    data: otherPosts,
    error,
    count,
  } = await query.returns<OverridedPosts[]>();

  if (error) {
    throw new Error(error.message);
  }

  let isFriend: boolean;

  if (nickname in friendCheckCache) {
    isFriend = friendCheckCache[nickname];
  } else {
    isFriend = await checkIsFriend(nickname);
    friendCheckCache[nickname] = isFriend;
  }

  const processedPinnedPosts = pinnedPost
    .map((post) => processPost(post, currentUser, isFriend))
    .filter((post): post is OverridedPosts => post !== null);

  const processedOtherPosts = otherPosts
    .map((post) => processPost(post, currentUser, isFriend))
    .filter((post): post is OverridedPosts => post !== null);

  const allPosts = [...processedPinnedPosts, ...processedOtherPosts];

  return {
    data: allPosts,
    meta: { count: count ?? 0 },
  };
}
