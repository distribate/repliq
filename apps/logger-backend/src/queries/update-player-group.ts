import { DonatePayload } from "../lib/commands/give-item-command";
import { lpDB } from "../shared/database/lp-db";

export async function updatePlayerGroup({
  donate, nickname
}: DonatePayload) {
  let currentUserUUID = await lpDB
  .selectFrom("luckperms_players")
  .select("uuid")
  .where("username", "=", nickname)
  .executeTakeFirstOrThrow()
  
  const currentUserQuery = await lpDB
  .selectFrom("luckperms_user_permissions")
  .select("permission")
  .where("uuid", "=", currentUserUUID.uuid)
  .execute()

  const currentUserGroups = currentUserQuery.filter(({ 
    permission
  }) => permission.startsWith("group")).map(item => item.permission)

  return await lpDB.transaction().execute(async (trx) => {
    if (currentUserGroups.length > 0) {
      await trx
        .deleteFrom("luckperms_user_permissions")
        .where("uuid", "=", currentUserUUID.uuid)
        .where("permission", "in", currentUserGroups)
        .execute();
    }

    return await trx
      .insertInto('luckperms_user_permissions')
      .values({
        uuid: currentUserUUID.uuid,
        permission: `group.${donate}`,
        contexts: ` `,
        world: "global",
        server: "global",
        value: true,
        expiry: 0
      })
      .returning("permission")
      .executeTakeFirstOrThrow()
  })
}