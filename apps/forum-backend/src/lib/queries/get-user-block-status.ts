import { forumDB } from "#shared/database/forum-db.ts";

export type UserBlockStatus = "blocked-by-user" | "blocked-by-you" | "none"

export async function getUserBlockStatus(currentUserNickname: string, requestedUserNickname: string): Promise<UserBlockStatus> {
  const query = await forumDB
    .selectFrom('users_blocked')
    .select(["initiator", "recipient"])
    .where((eb) =>
      eb.or([
        eb('initiator', '=', currentUserNickname),
        eb('recipient', '=', currentUserNickname)
      ]
    ))
    .where((eb) =>
      eb.or([
        eb('initiator', '=', requestedUserNickname),
        eb('recipient', '=', requestedUserNickname)
      ]
    ))
    .executeTakeFirst()

  if (!query) {
    return "none"
  }

  const { initiator, recipient } = query;

  if (initiator === currentUserNickname) {
    return "blocked-by-you"
  }

  if (recipient === currentUserNickname) {
    return "blocked-by-user"
  }

  return "none"
}