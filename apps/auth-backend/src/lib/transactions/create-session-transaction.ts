import type { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";
import { publishLoginNotify } from "../../publishers/pub-login-notify";
import { forumDB } from "../../shared/database/forum-db";
import { putSessionToken } from "../../utils/put-session-token";
import { createSession } from "../queries/create-session";
import type { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import type { z } from "zod/v4";

type CreateSessionTransaction = Omit<z.infer<typeof createSessionBodySchema>, "token" | "password"> & {
  token: string,
  ip: string;
} & {
  ua: string;
  browser: string;
  cpu: string;
  device: string;
  os: string;
}

type PushLoginNotify = Pick<CreateSessionTransaction, "nickname" | "browser" | "ip">

async function pushLoginNotify({
  browser, ip, nickname
}: PushLoginNotify) {
  const check = await forumDB
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

    await putSessionToken(nickname, token)

    return session;
  });

  pushLoginNotify({ browser, ip, nickname })

  return query;
}