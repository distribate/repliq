import { lpDB } from '#shared/database/lp-db.ts';
import type { PaymentDonateType } from '@repo/types/entities/payment-types.ts';

type UpdateDonateForPlayer = {
  nickname: string,
  donate: PaymentDonateType
}

export async function updateDonateForPlayer({
  donate, nickname,
}: UpdateDonateForPlayer) {
  try {
    return await lpDB
    .updateTable('luckperms_players')
    .set('primary_group', donate)
    .where('username', '=', nickname)
    .returning("primary_group")
    .executeTakeFirstOrThrow();
  } catch (e) {
    const error = e instanceof Error
      ? e.message : "An error occurred while updating donation information."
    console.error(error);
    
    throw new Error(error);
  }
}