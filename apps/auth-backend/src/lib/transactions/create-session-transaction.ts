import { publishLoginNotify } from "../../publishers/pub-login-notify";
import { forumDB } from "../../shared/database/forum-db";
import { createSession } from "../queries/create-session";
import { insertSessionInfo } from "../queries/insert-session-info";

type CreateSessionTransaction = {
  token: string,
  nickname: string
} & {
  info: {
    browser: string | null;
    cpu: string | null;
    ip: string | null;
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
        trx, details: { token, nickname },
      });

      await insertSessionInfo({
        trx,
        details: { session_id: session.session_id, ...info, nickname },
      });

      publishLoginNotify({
        browser: session.browser ?? "Unknown",
        ip: session.ip ?? "Unknown",
        nickname
      })

      return session;
    });
}