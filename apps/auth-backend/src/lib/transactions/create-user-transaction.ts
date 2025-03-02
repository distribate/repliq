import type { DB, InfoFindout, Users } from '@repo/types/db/forum-database-types.ts';
import type { Insertable, Transaction } from "kysely";
import { forumDB } from "../../shared/database/forum-db";
import { authDB } from '../../shared/database/auth-db';
import type { AUTH } from '@repo/types/db/auth-database-types';
import { publishRegisterNotify } from '../../publishers/pub-register-notify';

type InsertableUser = Pick<Insertable<Users>, "nickname">
type InsertableFindout = Pick<Insertable<InfoFindout>, "findout">

type CreateUserServer = Pick<Insertable<AUTH>,
  | "HASH"
  | "LOWERCASENICKNAME"
  | "NICKNAME"
  | "IP"
  | "REGDATE"
  | "UUID"
>

type CreateUserTransaction = InsertableUser & InsertableFindout & Omit<Insertable<AUTH>,
  | "TOTPTOKEN"
  | "LOGINIP"
  | "LOGINDATE"
  | "ISSUEDTIME"
  | "PREMIUMUUID"
> & {
  referrer?: string
}

async function createUserSettings(user_id: string, nickname: string, trx: Transaction<DB>) {
  return await trx
    .insertInto('users_settings')
    .values({ user_id, nickname })
    .returning("id")
    .executeTakeFirstOrThrow();
}

async function createInfoFindout(user_nickname: string, findout: string, trx: Transaction<DB>) {
  return await trx
    .insertInto('info_findout')
    .values({ user_nickname, findout })
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function createUserServer(values: CreateUserServer) {
  return await authDB
    .insertInto("AUTH")
    .values(values)
    .returning(["UUID", "NICKNAME"])
    .executeTakeFirstOrThrow()
}

const REFFERALS_LIMIT = 5

async function linkUserToReferer(trx: Transaction<DB>, nickname: string, referrer: string) {
  const isReffered = await trx
    .selectFrom("refferals")
    .select("id")
    .where("recipient", "=", nickname)
    .execute()

  if (isReffered.length > 0) {
    return;
  }

  const refferalsList = await trx
    .selectFrom("refferals")
    .select("id")
    .where("initiator", "=", referrer)
    .execute()

  if (refferalsList && refferalsList.length >= REFFERALS_LIMIT) {
    return;
  }

  await trx
    .insertInto("refferals")
    .values({ initiator: referrer, recipient: nickname, completed: false })
    .execute()
}

export const createUserTransaction = async ({
  nickname, findout, HASH, LOWERCASENICKNAME, NICKNAME, IP, REGDATE, UUID, referrer
}: CreateUserTransaction) => {
  return await forumDB.transaction().execute(async (trx) => {
    const userByServer = await createUserServer({
      HASH, LOWERCASENICKNAME, NICKNAME, IP, REGDATE, UUID
    })

    if (!userByServer.UUID) {
      return;
    }

    const userByForum = await trx
      .insertInto('users')
      .values({ nickname, uuid: userByServer.UUID })
      .returning(['nickname', 'id'])
      .executeTakeFirstOrThrow();

    const userSettings = await createUserSettings(userByForum.id, nickname, trx);

    if (!userSettings.id) {
      return;
    }

    const infoFindout = await createInfoFindout(nickname, findout, trx);

    if (!infoFindout.id) {
      return;
    }

    if (referrer) {
      await linkUserToReferer(trx, nickname, referrer);
    }

    publishRegisterNotify(nickname)

    return infoFindout;
  });
}