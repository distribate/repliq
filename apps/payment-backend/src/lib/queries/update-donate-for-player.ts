import { lpDB } from '#lib/db/db.ts';
import { z } from 'zod';
import { createOrderBodySchema } from '#routes/create-order.ts';

type UpdateDonateForPlayer = {
  nickname: string,
  donate: Pick<z.infer<typeof createOrderBodySchema>, 'donate'>['donate']
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