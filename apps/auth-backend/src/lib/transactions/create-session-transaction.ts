import { publishAuthNotify } from "../../puslishers/pub-auth-notify";
import { forumDB } from "../../shared/database/forum-db";
import { createSession } from "../../utils/create-session";
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
  }
}

export const createSessionTransaction = async ({
  token, nickname, info
}: CreateSessionTransaction) => {
  return await forumDB
  .transaction()
  .execute(async (trx) => {
    const session = await createSession({
      trx,
      details: { token, nickname },
    });

    await insertSessionInfo({
      trx,
      details: { session_id: session.session_id, ...info,nickname },
    });

    await publishAuthNotify({
      session_id: session.session_id,
      nickname,
    })

    return session;
  });
}