import type { DB } from '@repo/types/db/forum-database-types.ts';
import type { Transaction } from "kysely";
import { forumDB } from "../../shared/database/forum-db";
import { publishRegisterNotify } from '../../publishers/pub-register-notify';
import { validateRefferalsLength } from '../validators/validate-refferals-length';

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

type CreateCredentials = Omit<CreateUserOpts, "nickname"> & {
  userId: string,
  password: string
}

type CreateUserTrx = Pick<CreateUserOpts, "nickname"> & {
  referrer?: string | null,
  findout: string,
  password: string
}

async function createInfoFindout({ findout, nickname, trx }: CreateUserFindout) {
  return trx
    .insertInto('info_findout')
    .values({ user_nickname: nickname, findout })
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function linkUserToReferer({ nickname, referrer, trx }: LinkUser) {
  const isReffered = await trx
    .selectFrom("refferals")
    .select("id")
    .where("recipient", "=", nickname)
    .execute()

  if (isReffered.length > 0) return;

  const isValid = await validateRefferalsLength({ trx, referrer });
  if (!isValid) return;

  await trx
    .insertInto("refferals")
    .values({ initiator: referrer, recipient: nickname, completed: false })
    .execute()
}

type CreateUser = {
  trx: CreateUserOpts["trx"],
  nickname: string
}

async function createUser({ trx, nickname }: CreateUser) {
  return trx
    .insertInto('users')
    .values({ nickname })
    .returning(['nickname', 'id', 'created_at'])
    .executeTakeFirstOrThrow();
}

async function createCredentials({ trx, password, userId }: CreateCredentials) {
  const hash = Bun.password.hashSync(password, {
    algorithm: "bcrypt", cost: 10
  })

  return trx
    .insertInto('users_credentials')
    .values({ user_id: userId, hash })
    .returning(['id'])
    .executeTakeFirstOrThrow();
}

async function createUserSettings({ nickname, trx, user_id }: CreateUserSettings) {
  return trx
    .insertInto('users_settings')
    .values({ user_id, nickname })
    .returning("id")
    .executeTakeFirstOrThrow();
}

function notifyAboutRegister({ nickname, created_at }: { nickname: string, created_at: Date }) {
  publishRegisterNotify(nickname)
}

export const createUserTransaction = async ({
  nickname, referrer, findout, password
}: CreateUserTrx) => {
  const query = await forumDB.transaction().execute(async (trx) => {
    const createdUser = await createUser({ trx, nickname })

    const [createdCrendetials, createdSettings, createdFindout] = await Promise.all([
      createCredentials({ trx, userId: createdUser.id, password }),
      createUserSettings({ trx, user_id: createdUser.id, nickname: createdUser.nickname }),
      createInfoFindout({ trx, findout, nickname })
    ])

    if (!createdCrendetials.id || !createdSettings.id || !createdFindout.id) return;

    if (referrer) {
      await linkUserToReferer({ trx, nickname, referrer });
    }

    return { nickname, created_at: createdUser.created_at }
  })

  if (!query) return;

  notifyAboutRegister(query)

  return query;
}