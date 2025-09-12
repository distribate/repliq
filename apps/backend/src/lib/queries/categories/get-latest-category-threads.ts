import { forumDB } from "#shared/database/forum-db.ts";
import type { ThreadPreview } from "@repo/types/entities/thread-type";
import { sql } from "kysely";

type CategoryThreads = {
  category_id: number;
  category_title: string;
  category_description: string;
  threads: Array<ThreadPreview>;
};

// todo: refactor comment and replies 
export async function getLatestCategoryThreads(): Promise<CategoryThreads[] | null> {
  const threadsByCategory = await forumDB
    .selectFrom("category")
    .leftJoin(
      forumDB
        .selectFrom('threads')
        .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
        .leftJoin('threads_users', 'threads.id', 'threads_users.thread_id')
        .leftJoin('users', 'threads_users.nickname', 'users.nickname')
        .select(eb => [
          'threads.category_id',
          'threads.id as id',
          'threads.title as title',
          'threads.description as description',
          'threads.is_comments as is_comments',
          eb.cast<string>('threads.created_at', 'text').as('created_at'),
          sql<number>`COALESCE(COUNT(threads_views.id), 0)`.as('views_count'),
          sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('comments_count'),
          sql`ROW_NUMBER() OVER (PARTITION BY threads.category_id ORDER BY threads.created_at DESC)`.as('row_num'),
          sql<string>`users.nickname`.as('owner_nickname'),
          sql<string>`users.name_color`.as('owner_name_color'),
          sql<string>`users.avatar`.as('owner_avatar')
        ])
        .groupBy([
          'threads.id', 
          'users.nickname', 
          'users.name_color',
          "users.avatar"
        ])
        .as('top_threads'),
      'category.id',
      'top_threads.category_id'
    )
    .select([
      'category.id as category_id',
      'category.title as category_title',
      "category.description as category_description",
      'top_threads.id',
      'top_threads.title',
      'top_threads.description',
      'top_threads.is_comments',
      'top_threads.created_at',
      'top_threads.views_count',
      'top_threads.comments_count',
      'top_threads.row_num',
      'top_threads.owner_nickname',
      "top_threads.owner_avatar",
      'top_threads.owner_name_color',
    ])
    .where('top_threads.row_num', '<=', 5)
    .execute();

  const result: { [categoryId: number]: CategoryThreads } = threadsByCategory.reduce((acc, thread) => {
    const {
      category_id, category_title, id, title, created_at, views_count,
      comments_count, description, is_comments, category_description,
      owner_nickname, owner_name_color, owner_avatar
    } = thread;

    const categoryKey = Number(category_id)

    acc[categoryKey] = acc[categoryKey] || {
      category_id, category_title, category_description, threads: [],
    };

    acc[categoryKey].threads.push({
      id: id!,
      title: title!,
      description: description!,
      properties: {
        is_comments: is_comments!,
      },
      created_at: created_at!,
      views_count: views_count || 0,
      comments_count: comments_count || 0,
      owner: {
        nickname: owner_nickname!,
        name_color: owner_name_color!,
        avatar: owner_avatar,
      }
    });

    return acc;
  }, {} as { [categoryId: number]: CategoryThreads });

  const data = Object
    .values(result)
    .map(category => ({
      ...category,
      threads: category.threads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    }));

  return data
}