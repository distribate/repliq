import { forumDB } from "#shared/database/forum-db.ts"

type GetUserProfileViews = {
  nickname: string,
  fromDate?: Date,
}

export const getUserProflieViewsDetails = async (nickname: string) => {
  return await forumDB
    .selectFrom('profile_views')
    .select(["initiator", "recipient", "created_at"])
    .where('recipient', '=', nickname)
    .execute()
}

export const getUserProfileViews = async ({
  nickname, fromDate
}: GetUserProfileViews) => {
  let query = forumDB
    .selectFrom('profile_views')
    .select(forumDB.fn.countAll().as('count'))
    .where('recipient', '=', nickname)

  if (fromDate) {
    query = query
      .where('created_at', '>=', fromDate)
  }

  return await query.executeTakeFirstOrThrow()
}