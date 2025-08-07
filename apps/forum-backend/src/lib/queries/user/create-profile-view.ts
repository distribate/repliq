import type { createProfileViewSchema } from "#routes/user/create-profile-view.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import * as z from "zod";

type CreateProfileView = z.infer<typeof createProfileViewSchema> & Pick<InitiatorRecipientType, "initiator">

export async function createProfileView({ initiator, recipient }: CreateProfileView) {
  return forumDB
    .insertInto('profile_views')
    .values({ initiator, recipient })
    .returningAll()
    .executeTakeFirstOrThrow();
}