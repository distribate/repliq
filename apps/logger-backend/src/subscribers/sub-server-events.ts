import { getNatsConnection } from "@repo/config-nats/nats-client";
import { forumDB } from "../shared/database/forum-db";
import { UsersGameStatus } from "@repo/types/db/forum-database-types";
import { Selectable } from "kysely";
import { z } from "zod"
import { SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";

type UpdateUserStatus = Omit<Selectable<UsersGameStatus>, "id" | "joined" | "quited"> & {
  joined?: string | null;
  quited?: string | null;
};

async function updateUserStatus({
  nickname, status, joined, quited,
}: UpdateUserStatus) {
  const updateValues: Record<string, any> = { status };

  if (joined) updateValues.joined = joined;
  if (quited) updateValues.quited = quited;

  return await forumDB
    .insertInto("users_game_status")
    .values({ nickname, status, joined, quited })
    .onConflict((oc) => oc.column("nickname").doUpdateSet(updateValues))
    .returningAll()
    .executeTakeFirstOrThrow();
}

const userLoginEventSchema = z.object({
  nickname: z.string(),
  event: z.enum(["join", "quit"]),
  date: z.string(),
});

export const subscribeServerEvents = () => {
  const nc = getNatsConnection()

  return nc.subscribe(SERVER_USER_EVENT_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const payload = msg.json()
      const userLoginEvent = userLoginEventSchema.safeParse(payload)

      if (userLoginEvent.success) {
        try {
          const { nickname, event, date } = userLoginEvent.data;

          const user: UpdateUserStatus = {
            nickname,
            status: event,
            joined: event === "join" ? date : null,
            quited: event === "quit" ? date : null
          }

          await updateUserStatus(user)
        } catch (error) {
          console.error(error);
        }
      }
    }
  })
}