import { z } from 'zod';
import { forumDB } from '@repo/shared/db/forum-db.ts';
import type { Expression, SqlBool } from 'kysely';
import type { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import type { UserPostItem, GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';

type GetPosts = z.infer<typeof getUserPostsSchema> & {
  requestedUserNickname: string
}

type ValidatePostVisibility = {
  requestedUserNickname: string,
  currentUserNickname: string,
  post: UserPostItem
}

async function checkIsFriend(
  currentUserNickname: string, requestedUserNickname: string,
): Promise<boolean> {
  const friendships = await forumDB
  .selectFrom('users_friends')
  .select([ 'user_1', 'user_2' ])
  .where((eb) =>
    eb.or([
      eb('user_1', '=', requestedUserNickname),
      eb('user_2', '=', requestedUserNickname),
    ]),
  )
  .execute();
  
  return friendships
  .some(({ user_2, user_1 }) => [ user_1, user_2 ]
  .includes(currentUserNickname));
}

const processPost = async({
  post, currentUserNickname, requestedUserNickname,
}: ValidatePostVisibility) => {
  const isFriend = await checkIsFriend(currentUserNickname, requestedUserNickname);
  const { user_nickname: postCreator, visibility } = post;
  
  const canView =
    (visibility === 'all') ||
    (visibility === 'friends' && (isFriend || currentUserNickname === postCreator)) ||
    (visibility === 'only' && currentUserNickname === postCreator);
  
  return canView ? post : null;
};

export async function getUserPosts({
  limit, ascending = false, searchQuery, filteringType, range, currentUserNickname, requestedUserNickname,
}: GetPosts): Promise<GetUserPostsResponse | null> {
  const getPinnedPosts = async() => {
    return await forumDB
    .selectFrom('posts_with_comments_and_view_counts')
    .selectAll()
    .where('user_nickname', '=', requestedUserNickname)
    .where('isPinned', '=', true)
    .execute();
  };
  
  const getFilteredPosts = async() => {
    let query = forumDB
    .selectFrom('posts_with_comments_and_view_counts')
    .selectAll()
    .where((eb) => {
      const filters: Expression<SqlBool>[] = [];
      
      filters.push(eb('user_nickname', '=', requestedUserNickname));
      
      if (searchQuery) {
        filters.push(eb('content', 'like', `%${searchQuery}%`));
      }
      
      return eb.and(filters);
    });
    
    if (filteringType) {
      query = query.orderBy(
        filteringType === 'created_at' ? 'created_at' : 'views_count',
        ascending ? 'asc' : 'desc',
      );
    }
    
    if (range) {
      query = query
      .offset(Number(range[0]))
      .limit(Number(range[1]) - Number(range[0]) + 1);
    }
    
    if (limit) {
      query = query.limit(Number(limit));
    }
    
    return await query.execute()
  };
  
  const getPostsCount = async() => {
    return await forumDB
    .selectFrom('posts_with_comments_and_view_counts')
    .select(
      forumDB.fn.count('id').as('count'),
    )
    .where('user_nickname', '=', requestedUserNickname)
    .executeTakeFirst();
  };
  
  const [ pinnedPosts, otherPosts, countResult ] = await Promise.all([
    getPinnedPosts(), getFilteredPosts(), getPostsCount(),
  ]);
  
  const allPosts = [...pinnedPosts, ...otherPosts];
  const postIds = allPosts.map((post) => post.id);
  
  const postViews = await forumDB
  .selectFrom('posts_views')
  .select([ 'post_id', 'user_nickname' ])
  .where('post_id', 'in', postIds)
  .execute();
  
  const postsWithViews = allPosts.map((post) => {
    const views = postViews
    .filter((view) => view.post_id === post.id)
    .map((view) => view.user_nickname);
    
    const isViewed = views.includes(currentUserNickname);
    
    return { ...post, views, isViewed };
  });
  
  const visiblePosts = await Promise.all(
    postsWithViews.map((post) =>
      // @ts-expect-error
      processPost({ post, currentUserNickname, requestedUserNickname })
    )
  );
  
  const filteredPosts = visiblePosts.filter(
    (post): post is UserPostItem => post !== null
  );
  
  return {
    data: filteredPosts,
    meta: { count: Number(countResult?.count) ?? 0 },
  };
}