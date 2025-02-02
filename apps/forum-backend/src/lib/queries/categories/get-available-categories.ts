import { forumDB } from "#shared/database/forum-db.ts"

export const getAvailableCategories = async () => {
  return await forumDB
    .selectFrom("category")
    .select(eb => [
      "title",
      "available",
      "description",
      "emoji",
      "color",
      eb.cast<number>('id', 'int8').as('id')
    ])
    .orderBy("id", "asc")
    .execute();
}