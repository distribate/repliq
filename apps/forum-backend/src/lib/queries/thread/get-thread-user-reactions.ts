import { forumDB } from "#shared/database/forum-db.ts";

type GetThreadUserRating = {
  nickname: string;
  threadId: string;
};

export async function getThreadUserReactions({
  nickname, threadId
}: GetThreadUserRating) {
  const results = await forumDB
    .selectFrom('threads_reactions')
    .select(['emoji'])
    .where('thread_id', '=', threadId)
    .where('user_nickname', '=', nickname)
    .execute();

  if (!results.length) return { reactions: [] };

  return { reactions: results.map(row => row.emoji) };
}