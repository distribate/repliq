import { luckpermsSubscriber } from "../../shared/listener.ts"
import type { LuckpermsPlayers } from "@repo/types/db/luckperms-database-types"
import { forumDB } from "../../shared/db.ts"
import type { DonateVariantsEnum } from "@repo/types/entities/entities-type"

type LuckpermsPlayersPayload = LuckpermsPlayers

async function updateUserDonate({
  uuid, username, primary_group,
}: LuckpermsPlayers) {
  return await forumDB
  .updateTable('users')
  .set('donate', primary_group as DonateVariantsEnum)
  .where('nickname', '=', username)
  .where('uuid', '=', uuid)
  .execute();
}

export async function notifyByLuckpermsPrimaryGroupChannel() {
 return luckpermsSubscriber.notifications.on('luckperms_primary_group_channel', async(payload: LuckpermsPlayersPayload) => {
   if (payload) {
     return await updateUserDonate(payload)
   }
 });
}