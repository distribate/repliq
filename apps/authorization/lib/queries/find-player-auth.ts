import { authDB } from '#db/db.ts';
import type { AUTH } from '#types/db/auth-database-types.ts';

export async function findPlayer(criteria: Partial<Pick<AUTH, "NICKNAME" | "UUID">>) {
  let query = authDB.selectFrom('AUTH')
  
  if (criteria.NICKNAME) {
    query = query.where('NICKNAME', '=', criteria.NICKNAME)
  }
  
  if (criteria.UUID) {
    query = query.where('UUID', '=', criteria.UUID)
  }

  return await query.selectAll().executeTakeFirst()
}