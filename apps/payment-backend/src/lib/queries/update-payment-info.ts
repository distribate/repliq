import type { Updateable } from 'kysely';
import type { DB } from '@repo/types/db/payments-database-types.ts';
import { paymentsDB } from '#shared/database/payments-db.ts';

type Payments = Pick<DB, 'payments_crypto_ton'>['payments_crypto_ton']

type UpdatePaymentInfo = {
  orderId: string,
  updateable: Updateable<Payments>
}

export async function updatePaymentInfo({
  updateable, orderId,
}: UpdatePaymentInfo) {
  try {
    return await paymentsDB
    .updateTable('payments_crypto_ton')
    .set(updateable)
    .where('orderid', '=', orderId)
    .returning("id")
    .executeTakeFirstOrThrow();
  } catch (e) {
    const error = e instanceof Error ? e.message
      : 'An error occurred while updating payment info';
    
    throw new Error(error);
  }
}