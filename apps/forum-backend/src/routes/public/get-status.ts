import { zValidator } from "@hono/zod-validator";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { throwError } from "@repo/lib/helpers/throw-error";
import { SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { Hono } from "hono";
import ky from "ky";
import { z } from "zod/v4";

type ServerStatus = {
  online: boolean;
  host: string;
  port: number;
  ip_address: string | null;
  eula_blocked: boolean;
  retrieved_at: number;
  expires_at: number;
  version?: {
    name_raw: string;
    name_clean: string;
    name_html: string;
    protocol: number;
  };
  players?: {
    online: number;
    max: number;
    list: Array<{
      uuid: string;
      name_raw: string;
      name_clean: string;
      name_html: string;
    }>;
  };
  motd?: {
    raw: string;
    clean: string;
    html: string;
  };
  icon: string | null;
  mods: Array<{
    name: string;
    version: string;
  }>;
  software?: string | null;
  plugins?: Array<{
    name: string;
    version: string | null;
  }>;
  srv_record: {
    host: string;
    port: number;
  } | null;
};

const STATUS_API = ky.extend({
  prefixUrl: "https://api.mcstatus.io/v2/status/java",
})

async function getProxyStats() {
  const res = await STATUS_API
    .get(`mc.fasberry.su:25565`, {
      searchParams: {
        timeout: 5.0
      }
    })
    .json<ServerStatus>()

  return res
}

const _DEFAULT = {
  status: "offline",
  online: 0,
  max: 200,
  players: []
}

const getStatusRouteSchema = z.object({
  type: z.enum(["servers", "services"])
})

type StatusPayload = {
  maxPlayers: number,
  players: Array<string>,
  tps: Array<number>,
  currentOnline: number,
  mspt: number
}

async function getBisquiteStats() {
  const nc = getNatsConnection()

  const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify({
    event: "getServerStats"
  }), { timeout: 2000 })

  return res.json<StatusPayload>()
}

export const getStatusRoute = new Hono()
  .get("/get-status", zValidator("query", getStatusRouteSchema), async (ctx) => {
    const { type } = getStatusRouteSchema.parse(ctx.req.query())

    try {
      switch (type) {
        case "servers":
          let rawProxy = await getProxyStats()

          if (rawProxy.online === false) {
            const data = {
              proxy: _DEFAULT,
              servers: { bisquite: _DEFAULT }
            }

            return ctx.json({ data }, 200)
          }

          const rawBisquite = await getBisquiteStats()
          const proxy = rawProxy as ServerStatus

          const bisquite = "players" in rawBisquite ? {
            online: rawBisquite.currentOnline,
            max: rawBisquite.maxPlayers,
            players: rawBisquite.players,
            status: "online"
          } : _DEFAULT

          const data = {
            proxy: {
              status: "online",
              online: proxy.players?.online ?? 0,
              max: proxy.players?.max ?? 200,
              players: proxy.players?.list ? proxy.players.list.map((player) => player.name_raw) : []
            },
            servers: { bisquite }
          }

          ctx.header("Cache-Control", "public, max-age=60")

          return ctx.json({ data }, 200)
        case "services":
          return ctx.json({ error: "Not supported" }, 400)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })