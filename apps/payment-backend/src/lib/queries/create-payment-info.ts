import { paymentsDB } from '#lib/db/db.ts';
import type { Insertable } from 'kysely';
import type { DB } from '@repo/types/db/payments-database-types.ts';

type Payments = Pick<DB, "payments">["payments"]
type CreatePaymentInfo = Insertable<Payments>

export async function createPaymentInfo({
  price, donate, currency, nickname, captured, lt, hash, status, wallet, orderid
}: CreatePaymentInfo) {
  try {
    return await paymentsDB
    .insertInto('payments')
    .values({
      nickname, donate, orderid, wallet, hash, status, lt, captured, currency, price
    })
    .executeTakeFirstOrThrow()
  } catch (e) {
    throw new Error("Failed to create payment");
  }
}