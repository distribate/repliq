import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

const RATING_LIMIT = 200;

export const getUsersProfileViewsRank = async () => {
  return forumDB
  .selectFrom('profile_views')
  .select([
    'recipient',
    sql`COUNT(*)`.as('views_count'),
  ])
  .$narrowType<{ recipient: string; views_count: number }>()
  .groupBy('recipient')
  .orderBy(sql`COUNT(*)`, 'desc')
  .limit(RATING_LIMIT)
  .execute();
}