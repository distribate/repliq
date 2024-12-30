import { luckpermsSubscriber } from "../../shared/events/listener.ts"
import type { LuckpermsPlayers } from "@repo/types/db/luckperms-database-types"
import { pubDonatePayload } from "@repo/utils/nats/publishers/pub-donate-payload.ts";
import { donateSchema } from '@repo/types/schemas/payment/payment-schema.ts';

type LuckpermsPlayersPayload = LuckpermsPlayers

export async function notifyByLuckpermsPrimaryGroupChannel() {
 return luckpermsSubscriber.notifications.on('luckperms_primary_group_channel', async(payload: LuckpermsPlayersPayload) => {
   if (payload) {
    const validation = donateSchema.safeParse(payload.primary_group)

    if (!validation.success) return;

    return await pubDonatePayload({
      donate: validation.data, nickname: payload.username
    })
   }
 });
}