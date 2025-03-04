import type { DB } from '@repo/types/db/forum-database-types.ts';
import type { Insertable, Transaction } from "kysely";
import { forumDB } from "../../shared/database/forum-db";
import { authDB } from '../../shared/database/auth-db';
import type { AUTH } from '@repo/types/db/auth-database-types';
import { publishRegisterNotify } from '../../publishers/pub-register-notify';
import { validateRefferalsLength } from '../validators/validate-refferals-length';

type CreateUserServer = Pick<Insertable<AUTH>,
  | "HASH" | "NICKNAME" | "IP" | "REGDATE" | "UUID"
>

type CreateUserTransaction = Omit<Insertable<AUTH>,
  | "TOTPTOKEN"
  | "LOGINIP"
  | "LOGINDATE"
  | "ISSUEDTIME"
  | "PREMIUMUUID"
  | "REGDATE"
  | "LOWERCASENICKNAME"
> & {
  nickname: string;
  findout: string;
  referrer?: string
}

type CreateUserOpts = {
  nickname: string,
  trx: Transaction<DB>
}

type CreateUserSettings = CreateUserOpts & {
  user_id: string,
}

type CreateUserFindout = CreateUserOpts & {
  findout: string,
}

async function createUserSettings({
  nickname, trx, user_id
}: CreateUserSettings) {
  const query = await trx
    .insertInto('users_settings')
    .values({ user_id, nickname })
    .returning("id")
    .executeTakeFirstOrThrow();

  return query;
}

async function createInfoFindout({
  findout, nickname, trx
}: CreateUserFindout) {
  const query = await trx
    .insertInto('info_findout')
    .values({ user_nickname: nickname, findout })
    .returningAll()
    .executeTakeFirstOrThrow();

  return query;
}

async function createUserServer(values: CreateUserServer) {
  const query = await authDB
    .insertInto("AUTH")
    .values({ ...values, LOWERCASENICKNAME: values.NICKNAME.toLowerCase() })
    .returning(["UUID", "NICKNAME"])
    .executeTakeFirstOrThrow()

  return query;
}

async function linkUserToReferer(trx: Transaction<DB>, nickname: string, referrer: string) {
  const isReffered = await trx
    .selectFrom("refferals")
    .select("id")
    .where("recipient", "=", nickname)
    .execute()

  if (isReffered.length > 0) {
    return;
  }

  const isValid = await validateRefferalsLength(trx, referrer);

  if (!isValid) {
    return;
  }

  await trx
    .insertInto("refferals")
    .values({ initiator: referrer, recipient: nickname, completed: false })
    .execute()
}

export const createUserTransaction = async ({
  nickname, findout, HASH, NICKNAME, IP, UUID, referrer
}: CreateUserTransaction) => {
  const query = await forumDB.transaction().execute(async (trx) => {
    const REGDATE = new Date().getTime()

    const userByServer = await createUserServer({
      HASH, NICKNAME, IP, REGDATE, UUID
    })

    if (!userByServer.UUID) {
      return;
    }

    const userByForum = await trx
      .insertInto('users')
      .values({ nickname, uuid: userByServer.UUID })
      .returning(['nickname', 'id'])
      .executeTakeFirstOrThrow();

    const userSettings = await createUserSettings({
      user_id: userByForum.id, nickname, trx
    });

    if (!userSettings.id) {
      return;
    }

    const infoFindout = await createInfoFindout({
      nickname, findout, trx
    });

    if (!infoFindout.id) {
      return;
    }

    if (referrer) {
      await linkUserToReferer(trx, nickname, referrer);
    }

    return infoFindout;
  });

  if (query?.id) {
    publishRegisterNotify(nickname)
  }

  return query
}