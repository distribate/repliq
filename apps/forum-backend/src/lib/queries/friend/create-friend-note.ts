import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import type { addFriendNoteSchema } from "@repo/types/schemas/friend/create-friend-note-schema";
import type { z } from "zod";

type CreateFriendNote = z.infer<typeof addFriendNoteSchema> & Pick<InitiatorRecipientType, "initiator">

export async function createFriendNote({
  friend_id, recipient, initiator, message,
}: CreateFriendNote) {
  return await forumDB
    .insertInto('friends_notes')
    .values({
      friend_id: friend_id,
      recipient: recipient,
      initiator: initiator,
      note: message,
    })
    .onConflict((oc) => oc
      .columns(['friend_id', 'initiator', 'recipient'])
      .doUpdateSet({
        note: message
      })
    )
    .returning('note')
    .executeTakeFirstOrThrow();
}