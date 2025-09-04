import { forumDB } from "#shared/database/forum-db.ts";


type GetUserIsBlocked = InitiatorRecipientType

export const getUserIsBlocked = async ({
  initiator, recipient
}: GetUserIsBlocked) => {
  const query = await forumDB
  .selectFrom("users_blocked")
  .select([
    "initiator", "recipient"
  ])
  .where((eb) => eb.or([
    eb('initiator', '=', initiator),
    eb('recipient', '=', initiator),
  ]))
  .where((eb) => eb.or([
    eb('initiator', '=', recipient),
    eb('recipient', '=', recipient),
  ]))
  .executeTakeFirst();

  if (!query) {
    return null
  }

  if (query.initiator === initiator) {
    return "blocked-by-you"
  }

  if (query.recipient === initiator) {
    return "blocked-by-user"
  }

  return null
}