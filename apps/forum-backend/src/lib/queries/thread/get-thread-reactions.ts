import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

export async function getThreadReactions(threadId: string) {
  const results = await forumDB
    .selectFrom('threads_reactions')
    .select([
      'emoji',
      sql<number>`COUNT(*)`.as('count'),
    ])
    .where('thread_id', '=', threadId)
    .groupBy('emoji')
    .execute();
    
  if (!results.length) {
    return { reactions: {} };
  }
  
  const reactions = results.reduce((acc, row) => {
    acc[row.emoji] = row.count;
    return acc;
  }, {} as Record<string, number>);

  return { reactions };
}