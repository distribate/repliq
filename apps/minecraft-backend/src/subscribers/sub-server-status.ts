import { SERVER_API } from "#shared/api/minecraft-api.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"

type StatusPayload = {
  name: string,
  version: string,
  motd: string,
  currentPlayerCount: number,
  maxPlayerCount: number,
  players: Array<{ name: string }>
}

export const subscribeServerStatus = () => {
  const nc = getNatsConnection()

  return nc.subscribe("server.status", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err)
        return
      }

      const status: string = new TextDecoder().decode(msg.data)

      if (status !== "check") return msg.respond(JSON.stringify({}))

      const res = await SERVER_API.get("info").json<StatusPayload>()

      console.log(res)

      return msg.respond(JSON.stringify(res))
    }
  })
}