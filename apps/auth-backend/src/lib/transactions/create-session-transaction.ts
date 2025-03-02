import type { DB } from "@repo/types/db/forum-database-types";
import { publishLoginNotify } from "../../publishers/pub-login-notify";
import { forumDB } from "../../shared/database/forum-db";
import { putSessionToken } from "../../utils/put-session-token";
import { createSession } from "../queries/create-session";
import type { Transaction } from "kysely";
import type { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import type { z } from "zod";

type CreateSessionTransaction = Omit<z.infer<typeof createSessionBodySchema>, "token" | "password"> & {
  token: string,
  ip: string;
}

type PushLoginNotify = Pick<CreateSessionTransaction, "nickname" | "browser" | "ip"> & {
  trx: Transaction<DB>,
}

async function pushLoginNotify({
  browser, ip, nickname, trx
}: PushLoginNotify) {
  const check = await trx
    .selectFrom("users_session")
    .select(forumDB.fn.countAll().as("count"))
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (check && Number(check.count) > 1) {
    publishLoginNotify({ browser, ip, nickname })
  }
}

export const createSessionTransaction = async ({
  token, nickname, browser, cpu, ip, os, ua, device
}: CreateSessionTransaction) => {
  const query = await forumDB.transaction().execute(async (trx) => {
    const session = await createSession({
      trx, token, nickname, browser, cpu, ip, os, ua, device
    });

    await pushLoginNotify({ browser, ip, nickname, trx })
    await putSessionToken(nickname, token)

    return session;
  });

  return query;
}