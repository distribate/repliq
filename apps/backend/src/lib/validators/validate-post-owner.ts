import { forumDB } from "#shared/database/forum-db.ts"

type ValidatePostOwner  = {
  nickname: string
  postId: string
}

export async function validatePostOwner({
  nickname, postId
}: ValidatePostOwner): Promise<boolean> {
  const query = await forumDB
    .selectFrom("posts_users")
    .select(forumDB.fn.countAll().as("count"))
    .$castTo<{ count: number }>()
    .where("nickname", "=", nickname)
    .where("post_id", "=", postId)
    .executeTakeFirstOrThrow()

  return query.count > 0
}