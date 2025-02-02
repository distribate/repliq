import { lpDB } from "../shared/database/lp-db";
import { publishUpdateGroup } from "../publishers/pub-update-group";

export async function setPlayerGroup(nickname: string, permission: string) {
  try {
    let isUpdated: boolean = false;

    const updateQuery = await lpDB
      .updateTable("luckperms_user_permissions")
      .set({ permission, value: true })
      .where("uuid", "in", (eb) =>
        eb
          .selectFrom("luckperms_players")
          .select("uuid")
          .where("username", "=", nickname)
      )
      .executeTakeFirst()

    if (!updateQuery.numUpdatedRows) {
      const insertQuery = await lpDB
        .insertInto("luckperms_user_permissions")
        .values((eb) => ({
          uuid: eb.selectFrom("luckperms_players").select("uuid").where("username", "=", nickname).limit(1),
          permission,
          world: "global",
          expiry: 0,
          contexts: "{}",
          server: "global",
          value: true
        }))
        .executeTakeFirst();

      if (!insertQuery.numInsertedOrUpdatedRows) {
        return false;
      }

      isUpdated = true;
    } else {
      isUpdated = true;
    }

    if (!isUpdated) {
      return false;
    }

    publishUpdateGroup({ nickname, permission })

    return true;
  } catch (e) {
    console.error(e)
  }
}