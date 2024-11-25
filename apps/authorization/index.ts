import figlet from "figlet";
import { db } from '#db/db.ts';
import type { LuckpermsPlayers } from '#types/db/database-types.ts';
import { sleep, serve } from "bun";

export async function findPlayerByUUID(uuid: string) {
  return await db.selectFrom('luckperms_players')
  .where('uuid', '=', uuid)
  .selectAll()
  .executeTakeFirst()
}

export async function findPlayer(criteria: Partial<LuckpermsPlayers>) {
  let query = db.selectFrom('luckperms_players')
  
  if (criteria.username) {
    query = query.where('username', '=', criteria.username) // Kysely is immutable, you must re-assign!
  }
  
  if (criteria.uuid) {
    query = query.where('uuid', '=', criteria.uuid)
  }
  
  return await query.selectAll().execute()
}

export async function deletePlayer(uuid: string) {
  return await db.deleteFrom('luckperms_players').where('uuid', '=', uuid)
  .returningAll()
  .executeTakeFirst()
}

const server = serve({
  port: process.env.SERVICE_PORT,
  fetch(req, server) {
    const ip = server.requestIP(req);
    console.log(server)
    return new Response(`Your IP is ${ip}`);
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);