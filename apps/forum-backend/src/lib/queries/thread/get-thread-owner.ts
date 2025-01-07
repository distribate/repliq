import { forumDB } from "#shared/database/forum-db.ts";

type GetThreadOwner = {
  threadId: string
}

export async function getThreadOwner({
  threadId
}: GetThreadOwner) {
  const result = await forumDB
    .selectFrom('threads_users')
    .innerJoin(
      'users', 'threads_users.user_nickname', 'users.nickname'
    )
    .select([
      'users.nickname',
      'users.name_color'
    ])
    .where('threads_users.thread_id', '=', threadId)
    .executeTakeFirst();

  if (!result) return null;

  return result
}