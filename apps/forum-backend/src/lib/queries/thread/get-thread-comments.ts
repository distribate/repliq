import { forumDB } from '#shared/database/forum-db.ts';
import { z } from 'zod';
import type { getThreadCommentsSchema } from '@repo/types/schemas/thread/get-thread-comments-schema.ts';

type GetComments = z.infer<typeof getThreadCommentsSchema> & {
  threadId: string
};

export async function getCommentsReplied(initiatorId: string) {
  const result = await forumDB
  .selectFrom('threads_comments_replies')
  .select('recipient_comment_id')
  .where('initiator_comment_id', '=', initiatorId)
  .executeTakeFirst();
  
  return result || null;
}

async function getComment(commentId: string) {
  return await forumDB
  .selectFrom('threads_comments')
  .select(['id', 'created_at', 'content', 'user_nickname', 'edited'])
  .where('id', '=', commentId)
  .executeTakeFirstOrThrow()
}

async function getComments({
  threadId, range, ascending, limit
}: GetComments) {
  let query = forumDB
  .selectFrom('threads_comments')
  .select(['id', 'created_at', 'user_nickname', 'content', 'edited'])
  .where('thread_id', '=', threadId)
  .orderBy('created_at', ascending ? 'asc' : 'desc');
  
  if (range) {
    const offset = range[0];
    const limit = range[1] - range[0];
    query = query.offset(offset).limit(limit);
  } else {
    query = query.limit(8);
  }
  
  if (limit) {
    query = query.limit(limit);
  }

  return await query.execute()
}

export const getThreadComments = async ({
  ...values
}: GetComments) => {
  const threadComments = await getComments(values);
  
  if (!threadComments.length) return [];
  
  return Promise.all(
    threadComments.map(async (comment) => {
      const replied = await getCommentsReplied(comment.id);
      
      let repliedComment = null;
      
      if (replied) {
        repliedComment = await getComment(replied.recipient_comment_id);
      }
      
      return { ...comment, replied: repliedComment };
    }),
  );
}