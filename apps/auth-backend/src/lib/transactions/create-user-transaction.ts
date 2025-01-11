import type { InfoFindout, Users } from '@repo/types/db/forum-database-types.ts';
import type { Insertable } from "kysely";
import { forumDB } from "../../shared/database/forum-db";

type InsertableUser = Pick<Insertable<Users>, "nickname" | "uuid" | "real_name">
type InsertableFindout = Pick<Insertable<InfoFindout>, "findout">

type CreateUserTransaction = InsertableUser & InsertableFindout

export const createUserTransaction = async ({
  nickname, uuid, real_name, findout
}: CreateUserTransaction) => {
  return await forumDB.transaction().execute(async (trx) => {
    const user = await trx
      .insertInto('users')
      .values({ nickname, uuid, real_name })
      .returning(['nickname', 'id'])
      .executeTakeFirstOrThrow();

    await trx
      .insertInto('users_settings')
      .values({ user_id: user.id, nickname: user.nickname })
      .returningAll()
      .executeTakeFirstOrThrow();

    return await trx
      .insertInto('info_findout')
      .values({ user_nickname: user.nickname, findout })
      .returning('user_nickname')
      .executeTakeFirst();
  });
}