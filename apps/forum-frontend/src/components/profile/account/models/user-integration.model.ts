import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { logger } from "@repo/lib/utils/logger"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { toast } from "sonner"

export type Integration =
 | "minecraft"
 
type MinecraftService = { nickname: string, created_at: string, uuid: string }

export const connectionIsPendingAtom = atom(false, "connectionIsPending")

export const usersConnectedServiceAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getUsersConnectedServices())
}, "usersConnectedServiceAction").pipe(withDataAtom(), withStatusesAtom())

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

  return await ctx.schedule(() => disconnectProfile(type))
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
  onReject: (_, error) => {
    logger.error(error)
    toast.error("Произошла ошибка при отключении профиля")
  }
})

export const connectIntegrationAction = reatomAsync(async (ctx, type: Integration) => {
  connectionIsPendingAtom(ctx, true)

  return await ctx.schedule(() => connectProfile(type))
}, {
  name: "connectIntegrationAction",
  onFulfill: (_, res) => {
    if (!res) return;

    if ("error" in res) {
      toast.error(res.error)
      return;
    }

    logger.info(res.data)

    toast.success("Профиль успешно подключен")
  },
  onSettle: (ctx) => {
    connectionIsPendingAtom(ctx, false)
  }
}).pipe(withStatusesAtom())

async function getUsersConnectedServices() {
  const res = await forumUserClient.user["get-profiles"].$get()
  const data = await res.json()
  if (!data || "error" in data) return null;
  return data.data
}

async function connectProfile(type: Integration) {
  const res = await forumUserClient.user["connect-profile"].$post({ json: { type } })
  const data = await res.json()
  if (!data) return null;
  return data
}

async function disconnectProfile(type: Integration) {
  // @ts-expect-error
  const res = await forumUserClient.user["disconnect-profile"].$post({ json: { type } })
  const data = await res.json()
  if (!data) return null;
  return data
}