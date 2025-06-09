import type { getUserNotificationsSchema } from "#routes/user/get-user-notifications.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import { z } from "zod/v4";

const systemNotificationsSchema = z.enum(["auth", "vote", "issue", "payment"])
const newsNotificationsSchema = z.enum(["forum", "server"])
const requestsNotificationsSchema = z.enum(["request", "friend"])

const allNotificationsSchema = z.enum([
  ...systemNotificationsSchema.options,
  ...newsNotificationsSchema.options,
  ...requestsNotificationsSchema.options
]);

type AllNotifications = z.infer<typeof allNotificationsSchema>;

type GetUserNotifications = z.infer<typeof getUserNotificationsSchema> & {
  nickname: string
}

export async function getUserNotifications({
  nickname, type, cursor
}: GetUserNotifications) {
  let query = forumDB
    .selectFrom('notifications')
    .select((eb) => [
      "id",
      "message",
      "nickname",
      "read",
      "type",
      eb.cast<string>('created_at', 'text').as('created_at')
    ])
    .where("nickname", "=", nickname)

  let notificationsType: AllNotifications[] = systemNotificationsSchema.options;

  switch (type) {
    case "news":
      notificationsType = newsNotificationsSchema.options
      break;
    case "requests":
      notificationsType = requestsNotificationsSchema.options
      break;
    case "system":
      notificationsType = systemNotificationsSchema.options
      break;
  }

  query = query.where("type", "in", notificationsType)

  const res = await executeWithCursorPagination(query, {
    perPage: 32,
    after: cursor,
    fields: [
      {
        key: "created_at",
        direction: "desc",
        expression: "created_at"
      }
    ],
    parseCursor: (cursor) => ({
      created_at: cursor.created_at,
    })
  });

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
      endCursor: res.endCursor ?? undefined,
      startCursor: res.startCursor ?? undefined,
    }
  }
}