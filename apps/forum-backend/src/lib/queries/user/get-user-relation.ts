import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
// import { getUserIsBanned } from "./get-user-is-banned";
import { getUserIsBlocked } from "./get-user-is-blocked";
import { getUserIsPrivate } from "./get-user-is-private";

type GetUserRelation = InitiatorRecipientType

export async function getUserRelation({
  initiator, recipient
}: GetUserRelation) {
  // const isBanned = await getUserIsBanned(recipient)
  // if (isBanned) return "banned";

  const isBlocked = await getUserIsBlocked({ initiator, recipient })
  if (isBlocked) return isBlocked

  const isPrivate = await getUserIsPrivate({ initiator, recipient })
  if (isPrivate) return "private";

  return null
}