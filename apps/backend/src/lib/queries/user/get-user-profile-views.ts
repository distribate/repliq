import { forumDB } from "#shared/database/forum-db.ts"

type GetUserProfileViews = {
  nickname: string,
  fromDate?: Date,
}

export const getUserProflieViewsDetails = async (nickname: string) => {
  return forumDB
    .selectFrom('profile_views')
    .innerJoin("users", "users.nickname", "profile_views.recipient")
    .select([
      "initiator", 
      "recipient", 
      "profile_views.created_at",
      "users.avatar"
    ])
    .where('recipient', '=', nickname)
    .execute()
}

export const getUserProfileViews = async ({
  nickname, fromDate
}: GetUserProfileViews) => {
  let query = forumDB
    .selectFrom('profile_views')
    .select(
      forumDB.fn.countAll().as('count')
    )
    .where('recipient', '=', nickname)

  if (fromDate) {
    query = query.where('created_at', '>=', fromDate)
  }

  return query.executeTakeFirstOrThrow()
}