import { z } from 'zod';
import { forumDB } from '../../shared/db.ts';
import type { Expression, SqlBool } from 'kysely';
import type { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';

type GetPosts = z.infer<typeof getUserPostsSchema> & {
  requestedUserNickname: string
}

type ValidateFriendship = {
  currentUserNickname: string, requestedUserNickname: string,
}

async function validateFriendship({
  requestedUserNickname, currentUserNickname
}: ValidateFriendship): Promise<boolean> {
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

export async function getUserPosts({
  ascending, searchQuery, filteringType, range, currentUserNickname, requestedUserNickname
}: GetPosts): Promise<GetUserPostsResponse | null> {
  const isFriend = await validateFriendship({
    requestedUserNickname, currentUserNickname
  });
  
  const getFilteredPosts = async() => {
    let query = forumDB
    .selectFrom('posts_with_comments_and_view_counts')
    .selectAll()
    .where((eb) => {
      const filters: Expression<SqlBool>[] = [];
      
      filters.push(eb('user_nickname', '=', requestedUserNickname));

      if (searchQuery && searchQuery.trim() !== '') {
        filters.push(eb('content', 'like', `%${searchQuery}%`));
      }
      
      return eb.and(filters);
    })
    .where((eb) => {
      if (isFriend) {
        return eb.or([
          eb('visibility', '=', 'all'),
          eb('visibility', '=', 'friends'),
        ]);
      } else if (requestedUserNickname === currentUserNickname) {
        return eb('visibility', '=', 'only');
      } else {
        return eb("visibility", "=", 'all')
      }
    })
    
    if (filteringType) {
      query = query.orderBy(
        filteringType === 'created_at' ? 'created_at' : 'views_count',
        ascending ? 'asc' : 'desc',
      );
    }
    
    if (range) {
      const offset = range[0];
      const limit = range[1] - range[0];
      query = query.offset(offset).limit(limit);
    } else {
      query = query.limit(8);
    }
    
    return await query.execute()
  };
  
  const getPostsCount = async() => {
    return await forumDB
    .selectFrom('posts_with_comments_and_view_counts')
    .select(
      forumDB.fn.count('id').as('count')
    )
    .where('user_nickname', '=', requestedUserNickname)
    .where((eb) => {
      if (isFriend) {
        return eb.or([
          eb('visibility', '=', 'all'),
          eb('visibility', '=', 'friends'),
        ]);
      } else if (isFriend && requestedUserNickname === currentUserNickname) {
        return eb('visibility', '=', 'only');
      } else {
        return eb("visibility", "=", 'all')
      }
    })
    .executeTakeFirst()
  };
  
  const [ otherPosts, countResult ] = await Promise.all([
    getFilteredPosts(), getPostsCount()
  ]);
  
  if (!otherPosts.length) {
    return {
      data: [], meta: { count: 0 }
    }
  }
  
  const allPosts = otherPosts
  const postIds = allPosts.map((post) => post.id);
  
  const postViews = await forumDB
  .selectFrom('posts_views')
  .select([ 'post_id', 'user_nickname' ])
  .where('post_id', 'in', postIds)
  .execute();
  
  const postsWithViews = allPosts.map((post) => {
    const views = postViews
    .filter(view => view.post_id === post.id)
    .map(view => view.user_nickname);
    
    const isViewed = views.includes(currentUserNickname);
    
    return { ...post,
      isViewed,
      views_count: Number(post.views_count),
      comments_count: Number(post.comments_count)
    };
  });

  return {
    // @ts-expect-error
    data: postsWithViews,
    meta: { count: Number(countResult?.count) ?? 0 },
  };
}