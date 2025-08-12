import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { logger } from "@repo/lib/utils/logger"
import { forumUserClient } from "#shared/forum-client"
import { toast } from "sonner"

export type Integration =
  | "minecraft"

type MinecraftService = { nickname: string, created_at: string, uuid: string }

export const connectionIsPendingAtom = atom(false, "connectionIsPending")

export const usersConnectedServiceAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-profiles"].$get()
    const data = await res.json()
    if ("error" in data) throw new Error(data.error);
    return data.data
  })
}, {
  name: "usersConnectedServiceAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  },
}).pipe(withDataAtom(), withStatusesAtom())

usersConnectedServiceAction.dataAtom.onChange((ctx, state) => {
  if (!state || !state.length) return;

  minecraftServiceIsConnectedAtom(ctx, state.some(service => service.id === "minecraft"))

  const minecraftService = state.find(service => service.id === "minecraft")?.details

  if (minecraftService) {
    minecraftServiceDetailsAtom(ctx, minecraftService)
  }
})

export const minecraftServiceIsConnectedAtom = atom(false, "minecraftServiceIsConnected")
export const minecraftServiceDetailsAtom = atom<MinecraftService | undefined>(undefined, "minecraftServiceDetails")

export const disconnectIntegrationAction = reatomAsync(async (ctx, type: Integration) => {
  connectionIsPendingAtom(ctx, true)

  return await ctx.schedule(async () => {
    // @ts-expect-error
    const res = await forumUserClient.user["disconnect-profile"].$post({ json: { type } })
    const data = await res.json()
    if ("error" in data) throw new Error(data.error)
    return data
  })
}, {
  name: "disconnectIntegrationAction",
  onFulfill: (_, res) => {
    if (!res) return;

    if ("error" in res) {
      toast.error(res.error)
      return;
    }

    logger.info(res.data)

    toast.success("Профиль успешно отключен")
  },
  onSettle: (ctx) => {
    connectionIsPendingAtom(ctx, false)
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error("Произошла ошибка при отключении профиля")
    }
  }
})

export const connectIntegrationAction = reatomAsync(async (ctx, type: Integration) => {
  connectionIsPendingAtom(ctx, true)

  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["connect-profile"].$post({ json: { type } })
    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data
  })
}, {
  name: "connectIntegrationAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  },
  onFulfill: (_, res) => {
    if (!res) return;

    logger.info(res.data)

    toast.success("Профиль успешно подключен")
  },
  onSettle: (ctx) => {
    connectionIsPendingAtom(ctx, false)
  }
}).pipe(withStatusesAtom())