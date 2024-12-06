import { type PaymentDonateType } from '#routes/create-order';
import { forumDB } from '#lib/db/db.ts';
import type { DB } from '@repo/types/db/forum-database-types.ts';

type Donate = Pick<DB, 'landing_donate'>

export async function getDonateDetails(criteria: Partial<Donate['landing_donate']>) {
  let query = forumDB.selectFrom('landing_donate')
  
  if (criteria.id) {
    query = query.where('id', '=', criteria.id["__select__"]);
  }
  
  if (criteria.title) {
    query = query.where('title', '=', criteria.title);
  }
  
  if (criteria.origin) {
    query = query.where('origin', '=', criteria.origin);
  }
  
  const data = await query.selectAll().executeTakeFirst()
  
  if (!data) {
    throw new Error(`Received donate by criteria not found`);
  }
  
  return { ...data, origin: data.origin as PaymentDonateType };
}