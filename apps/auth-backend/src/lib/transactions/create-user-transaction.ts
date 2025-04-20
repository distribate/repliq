import type { DB } from '@repo/types/db/forum-database-types.ts';
import type { Insertable, Transaction } from "kysely";
import { forumDB } from "../../shared/database/forum-db";
import { authDB } from '../../shared/database/auth-db';
import type { AUTH } from '@repo/types/db/auth-database-types';
import { publishRegisterNotify } from '../../publishers/pub-register-notify';
import { validateRefferalsLength } from '../validators/validate-refferals-length';

type CreateUserServer = Pick<Insertable<AUTH>, | "HASH" | "NICKNAME" | "IP" | "REGDATE" | "UUID">

type CreateUserTransaction = Omit<Insertable<AUTH>,
  | "TOTPTOKEN" | "LOGINIP" | "LOGINDATE" | "ISSUEDTIME" | "PREMIUMUUID" | "REGDATE" | "LOWERCASENICKNAME"
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

type LinkUser = CreateUserOpts & {
  referrer: string
}

async function createUserSettings({
  nickname, trx, user_id
}: CreateUserSettings) {
  return trx
    .insertInto('users_settings')
    .values({ user_id, nickname })
    .returning("id")
    .executeTakeFirstOrThrow();
}

async function createInfoFindout({
  findout, nickname, trx
}: CreateUserFindout) {
  return trx
    .insertInto('info_findout')
    .values({ user_nickname: nickname, findout })
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function createUserServer(values: CreateUserServer) {
  return authDB
    .insertInto("AUTH")
    .values({ ...values, LOWERCASENICKNAME: values.NICKNAME.toLowerCase() })
    .returning(
      ["UUID", "NICKNAME"]
    )
    .executeTakeFirstOrThrow()
}

async function linkUserToReferer({
  nickname, referrer, trx
}: LinkUser): Promise<void> {
  const isReffered = await trx
    .selectFrom("refferals")
    .select("id")
    .where("recipient", "=", nickname)
    .execute()

  if (isReffered.length > 0) {
    return;
  }

  const isValid = await validateRefferalsLength({ trx, referrer });

  if (!isValid) return;

  await trx
    .insertInto("refferals")
    .values({ initiator: referrer, recipient: nickname, completed: false })
    .execute()
}

export const createUserTransaction = async ({
  nickname, findout, HASH, NICKNAME, IP, UUID, referrer
}: CreateUserTransaction) => {
  const REGDATE = new Date().getTime()

  const query = await forumDB.transaction().execute(async (trx) => {
    const userByServer = await createUserServer({ HASH, NICKNAME, IP, REGDATE, UUID })

    if (!userByServer.UUID) return;

    const userByForum = await trx
      .insertInto('users')
      .values({ nickname, uuid: userByServer.UUID })
      .returning(
        ['nickname', 'id']
      )
      .executeTakeFirstOrThrow();

    const userSettings = await createUserSettings({
      user_id: userByForum.id, nickname, trx
    });

    if (!userSettings.id) return;

    const infoFindout = await createInfoFindout({ nickname, findout, trx });

    if (!infoFindout.id) return;

    if (referrer) {
      await linkUserToReferer({ trx, nickname, referrer });
    }

    return infoFindout;
  });

  if (query?.id) {
    publishRegisterNotify(nickname)
  }

  return query
}