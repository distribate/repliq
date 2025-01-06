import { forumDB } from "#shared/database/forum-db.ts";

type ControlThreadRating = {
  threadId: string;
  nickname: string;
  emoji: string
}

export async function deleteThreadReaction({ threadId, nickname, emoji }: ControlThreadRating) {
  return await forumDB
    .deleteFrom('threads_reactions')
    .where('thread_id', '=', threadId)
    .where('user_nickname', '=', nickname)
    .where('emoji', '=', emoji)
    .executeTakeFirstOrThrow();
}

export async function createThreadReaction({ threadId, nickname, emoji }: ControlThreadRating) {
  return await forumDB
    .insertInto('threads_reactions')
    .values({
      thread_id: threadId, 
      user_nickname: nickname, 
      emoji
    })
    .returning("id")
    .executeTakeFirstOrThrow();
}