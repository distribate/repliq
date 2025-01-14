import { getNatsConnection } from '@repo/config-nats/nats-client';
import { DonatePayload } from '@repo/utils/nats/publishers/pub-donate-payload';
import { updatePlayerGroup } from '../queries/update-player-group';
import { callServerCommand } from '../utils/call-command';
import { callBroadcast } from '../utils/call-broadcast';
import { USER_NOTIFICATIONS_SUBJECT } from '@repo/shared/constants/nats-subjects';

export async function subscribeUpdateDonateForPlayer() {
  const nc = getNatsConnection()

  return nc.subscribe(USER_NOTIFICATIONS_SUBJECT, {
    callback: async (e, msg) => {
      if (e) {
        console.error(e)
        return;
      }

      const payload = msg.json<DonatePayload>()

      const { donate, nickname } = payload

      const broadcastMsg = `Игрок ${nickname} приобрел привилегию ${donate}`
      const commandValue = `toast ${nickname} Поздравляем!`

      try {
        await Promise.all([
          updatePlayerGroup(payload),
          callBroadcast(broadcastMsg),
          callServerCommand({ parent: "cmi", value: commandValue })
        ])
      } catch (e) {
        console.error(e)
      }
    }
  })
}