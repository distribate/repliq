import { forumDB } from "#shared/database/forum-db.ts"
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type DeleteFriend =
  Pick<InitiatorRecipientType, "recipient"> // initiator or recipient can delete
  & {
    request_id: string,
  }

export async function deleteFriendRequest({
  request_id, recipient
}: DeleteFriend) {
  return await forumDB
    .deleteFrom('friends_requests')
    .where("id", "=", request_id)
    .where((eb) => eb.or([
      eb('initiator', '=', recipient),
      eb('recipient', '=', recipient),
    ]))
    .execute();
}