import type { LuckpermsPlayers } from "@repo/types/db/luckperms-database-types.ts";
import { lpDB } from "#lib/db/db.ts";

export async function findPlayer(criteria: Partial<LuckpermsPlayers>) {
  let query = lpDB.selectFrom("luckperms_players");

  if (criteria.username) {
    query = query.where("username", "=", criteria.username);
  }

  if (criteria.uuid) {
    query = query.where("uuid", "=", criteria.uuid);
  }

  return await query.selectAll().executeTakeFirst();
}
