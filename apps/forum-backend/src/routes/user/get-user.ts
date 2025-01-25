import { Hono } from 'hono';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';
import { getUserRelation } from '#lib/queries/user/get-user-relation.ts';
import { getUser, type GetUserType } from '#lib/queries/user/get-user.ts';

export const getUserRoute = new Hono()
  .get('/get-user/:nickname', async (ctx) => {
    const { nickname: recipient } = ctx.req.param();

    const initiator = getNickname()

    const userRelation = await getUserRelation({
      initiator, recipient
    })

    let getUserType: GetUserType = "shorted"

    if (userRelation === "private" || userRelation === "blocked-by-you" || userRelation === "blocked-by-user") {
      getUserType = "shorted"
    } else {
      getUserType = "detailed"
    }

    try {
      const user = await getUser({
        initiator, recipient, type: getUserType
      });

      return ctx.json({ data: user }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
  );