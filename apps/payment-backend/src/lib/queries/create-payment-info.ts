import type { Insertable } from 'kysely';
import type { DB } from '@repo/types/db/payments-database-types.ts';
import { paymentsDB } from '#shared/database/auth-db.ts';

type Payments = Pick<DB, "payments">["payments"]
type CreatePaymentInfo = Insertable<Payments>

export async function createPaymentInfo(values: CreatePaymentInfo) {
  try {
    return await paymentsDB
    .insertInto('payments')
    .values(values)
    .executeTakeFirstOrThrow()
  } catch (e) {
    console.error(e)
    throw new Error("Failed to create payment");
  }
}