"use server";

import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

type GetUpdatedPost = Pick<UserPostItem, "id" | "user_nickname">

type PostViews = {
  isViewed: Array<{ user_id: string; }>;
  views_count: number;
  comments_count: number;
};

export async function getUpdatedPost({
  user_nickname, id,
}: GetUpdatedPost): Promise<UserPostItem | null> {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const api = createClient();

  const { data: views } = await api
    .from("posts_with_comments_and_view_counts")
    .select(
      `
    *,
    isViewed: posts_views(user_id)
  `,
      { count: "exact" },
    )
    .eq("user_nickname", user_nickname)
    .eq("id", id)
    .single();

  const { data, error } = await api
    .from("posts")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const postViews = views as PostViews;

  const isViewed =
    Array.isArray(postViews) &&
    postViews.isViewed.some((view) => view.user_id === currentUser.id);

  return {
    ...data,
    isViewed,
    views_count: views.views_count,
    user_nickname,
    comments_count: views.comments_count,
  };
}
