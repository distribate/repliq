import { getNatsConnection } from '@repo/config-nats/nats-client';
import { DonatePayload } from '@repo/utils/nats/publishers/pub-donate-payload';
import { updatePlayerGroup } from '../queries/update-player-group';
import { callServerCommand } from '../utils/call-command';
import { callBroadcast } from '../utils/call-broadcast';

export async function subUpdateDonateForPlayer() {
  const nc = getNatsConnection()

  return nc.subscribe("server.give.donate", {
    callback: async (e, msg) => {
      if (e) {
        console.error(e)
        return;
      }

      const payload: DonatePayload = msg.json()

      const { donate, nickname } = payload
      
      const broadcastMsg = `Игрок ${nickname} приобрел привилегию ${donate}`
      const commandValue = `toast ${nickname} Поздравляем!`

      await Promise.all([
        updatePlayerGroup(payload),
        callBroadcast(broadcastMsg),
        callServerCommand({ parent: "cmi",value: commandValue })
      ])
    }
  })
}