import { publishLoginNotify } from "../../publishers/pub-login-notify";
import { forumDB } from "../../shared/database/forum-db";
import { putSessionToken } from "../../utils/put-session-token";
import { createSession } from "../queries/create-session";

type CreateSessionTransaction = {
  token: string,
  nickname: string
} & {
  info: {
    browser: string | null;
    cpu: string | null;
    ip: string;
    isBot: boolean | null;
    os: string | null;
    ua: string | null;
    device: string | null;
  }
}

export const createSessionTransaction = async ({
  token, nickname, info
}: CreateSessionTransaction) => {
  return await forumDB
    .transaction()
    .execute(async (trx) => {
      const session = await createSession({
        trx, details: { token, nickname }, info,
      });

      const check = await trx
        .selectFrom("users_session")
        .select(forumDB.fn.countAll().as("count"))
        .where("nickname", "=", session.nickname)
        .executeTakeFirst()

      if (check && Number(check.count) > 1) {
        publishLoginNotify({ 
          browser: session.browser, ip: session.ip, nickname: session.nickname 
        })
      }

      await putSessionToken(nickname, token)

      return session;
    });
}