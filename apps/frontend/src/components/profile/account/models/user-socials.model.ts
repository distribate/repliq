import { reatomAsync, reatomResource, withCache, withDataAtom, withStatusesAtom } from '@reatom/async'
import { currentUserAtom } from '#components/user/models/current-user.model'
import { rootClient, userClient } from '#shared/forum-client'
import { action, atom, batch } from '@reatom/core'
import { sleep, withReset } from '@reatom/framework'
import { reatomTimer } from '@reatom/timer'
import { toast } from 'sonner'
import { logger } from '@repo/shared/utils/logger.ts'
import { validateResponse } from '#shared/api/validation'
import { es } from '#shared/constants/es'

export type Connect = {
  type: "connect" | "cancel" | "disconnect"
  signal: AbortSignal,
  service: "telegram" | "discord",
}

type EventSourceMsg = {
  nickname: string,
  status: "success" | "error"
  service: Connect["service"],
}

type Integration = {
  title: string,
  service: Connect["service"]
}

type Service = {
  created_at: string | Date,
  value: string
}

const CONNECT_ERROR_MAP: Record<string, string> = {
  "Exists token": "Подождите немного"
}

const CONNECT_SERVICE_SSE_URL = process.env.NODE_ENV === 'production'
  ? "https://api.fasberry.su/forum/connect-service/sse" : "http://localhost:4101/forum/connect-service/sse"

export const telegramAtom = atom<Service | null>(null, "telegram").pipe(withReset())
export const discordAtom = atom<Service | null>(null, "discord").pipe(withReset())
export const connectDialogIsOpenAtom = atom(false, "connectDialogIsOpen")
export const connectUrlAtom = atom<string | null>(null, "connectUrlAtom").pipe(withReset())

export const connectTimer = reatomTimer({
  interval: 1000,
  delayMultiplier: 1000,
  progressPrecision: 2,
  resetProgress: true
})

export const connectRemainsAtom = atom((ctx) => (ctx.spy(connectTimer) / 1000).toFixed(1))

export const msgAtom = atom<EventSourceMsg | null>(null, "msgAtom")
export const connectIsSuccessAtom = atom(false, "isSuccess")
export const eventSourceAtom = atom<EventSource | null>(null, "eventSource")

msgAtom.onChange((ctx, target) => {
  if (!target) return;

  if (target.status === 'success') {
    let source = ctx.get(eventSourceAtom)

    if (source) {
      source.close()

      connectTimer.stopTimer(ctx);
      
      batch(ctx, () => {
        eventSourceAtom(ctx, null)
        connectIsSuccessAtom(ctx, true)
      })
    }
  }
})

eventSourceAtom.onChange((ctx, target) => {
  if (!target) return;

  target.onopen = () => console.log("ok");

  target.addEventListener("payload", (event) => {
    try {
      const message: EventSourceMsg = JSON.parse(event.data);
      msgAtom(ctx, message)
    } catch (err) {
      logger.error('Failed to parse message data:', event.data, err);
    }
  })
})

const connectActionVariablesAtom = atom<Omit<Connect, "signal"> | null>(null, "connectActionVariables")

export const connectAction = reatomAsync(async (ctx, type: Connect["type"], service: Connect["service"]) => {
  if (service === 'discord') {
    toast.error("Service is not defined")
    return;
  }

  connectDialogIsOpenAtom(ctx, true)

  const isProccessed = ctx.get(connectActionVariablesAtom)
  if (isProccessed) return;

  connectActionVariablesAtom(ctx, { type, service })

  return await ctx.schedule(async () => {
    const res = await rootClient["connect-service"].$post(
      { query: { service, type } }, { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res);
  })
}, {
  name: "connectAction",
  onReject: (ctx, e) => {
    if (e instanceof Error) {
      toast.error(CONNECT_ERROR_MAP[e.message] ?? e.message)
      connectDialogIsOpenAtom(ctx, false)
    }
  },
  onFulfill: async (ctx, res) => {
    if (!res) return;

    const variables = ctx.get(connectActionVariablesAtom)
    if (!variables) return;

    const { type, service } = variables

    if (type === 'connect') {
      connectUrlAtom(ctx, res)
      connectTimer.startTimer(ctx, 5 * 60)
      eventSourceAtom(ctx, es(CONNECT_SERVICE_SSE_URL))
    }

    if (type === 'cancel') {
      connectUrlAtom.reset(ctx)
      connectDialogIsOpenAtom(ctx, false)

      let source = ctx.get(eventSourceAtom)

      if (source) {
        source.close()
        eventSourceAtom(ctx, null)
      }
    }

    if (type === 'disconnect' && service === 'telegram') {
      telegramAtom.reset(ctx)
      connectDialogIsOpenAtom(ctx, false)
      toast.success("Телеграм отвязан")
    }
  }
}).pipe(withStatusesAtom())

export const integrationSettingsDialogIsOpenAtom = atom(false, "integrationSettingsDialogIsOpen")
export const integrationTypeAtom = atom<Integration | null>(null, "integrationType").pipe(withReset())

integrationSettingsDialogIsOpenAtom.onChange(async (ctx, target) => {
  if (!target) {
    await ctx.schedule(() => sleep(300))

    integrationTypeAtom.reset(ctx)
  }
})

export const openIntegrationSettingsAction = action((ctx, value: boolean, type: Integration) => {
  integrationSettingsDialogIsOpenAtom(ctx, value)
  integrationTypeAtom(ctx, type)
})

export const userSocialsResource = reatomResource(async (ctx) => {
  const nickname = ctx.get(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(async () => {
    const res = await userClient.user["user-socials"].$get(
      { param: { nickname } }, { init: { signal: ctx.controller.signal } }
    )

    const data = await res.json()

    if ('error' in data) throw new Error(data.error)

    return data.data
  })
}, "userSocialsResource").pipe(withDataAtom(), withStatusesAtom(), withCache())

userSocialsResource.dataAtom.onChange((ctx, state) => {
  if (!state) return;

  batch(ctx, () => {
    telegramAtom(ctx, state.find(target => target.type === 'telegram') ?? null)
    discordAtom(ctx, state.find(target => target.type === 'discord') ?? null)
  })
})