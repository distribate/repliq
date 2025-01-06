import { forumDB } from "#shared/database/forum-db.ts";

type AcceptFriendRequestTransaction = {
  initiator: string,
  request_id: string
}

export async function acceptFriendRequestTransaction({
  request_id, initiator
}: AcceptFriendRequestTransaction) {
  return await forumDB.transaction().execute(async (trx) => {
    const deleteRequest = await trx
      .deleteFrom('friends_requests')
      .where("id", "=", request_id)
      .where((eb) => eb.or([
        eb('initiator', '=', initiator),
        eb('recipient', '=', initiator),
      ]))
      .returning(["recipient", "initiator"])
      .executeTakeFirstOrThrow();

    console.log(deleteRequest)
    const { recipient, initiator: requestInitiator } = deleteRequest

    return await trx
      .insertInto('users_friends')
      .values({
        user_1: requestInitiator,
        user_2: recipient
      })
      .executeTakeFirstOrThrow();
  });
}