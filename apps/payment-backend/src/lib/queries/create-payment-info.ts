import type { Insertable } from 'kysely';
import type { DB } from '@repo/types/db/payments-database-types.ts';
import { paymentsDB } from '#shared/database/payments-db.ts';

type Payments = Pick<DB, "payments_crypto_ton">["payments_crypto_ton"]
type CreatePaymentInfo = Insertable<Payments>

export async function createPaymentInfo(values: CreatePaymentInfo) {
  return await paymentsDB
    .insertInto('payments_crypto_ton')
    .values(values)
    .executeTakeFirstOrThrow()
} 