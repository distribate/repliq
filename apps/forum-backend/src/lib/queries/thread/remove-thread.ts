import { forumDB } from "#shared/database/forum-db.ts";

// todo
async function removeThreadImages(threadId: string) {
  
}

export const removeThread = async (threadId: string) => {
  let query = await forumDB.transaction().execute(async (db) => {
    await removeThreadImages(threadId);
    await db
      .deleteFrom('threads_users')
      .where('thread_id', '=', threadId)
      .execute();
    await db
      .deleteFrom('threads_comments')
      .where('thread_id', '=', threadId)
      .execute();
    await db
      .deleteFrom('threads_reactions')
      .where('thread_id', '=', threadId)
      .execute();
    return await db
      .deleteFrom('threads')
      .where('id', '=', threadId)
      .execute();
  });

  return query;
}