import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { es } from "#shared/constants/es";
import { MAIN_BASE_URL } from "#shared/env";
import { throwAppError } from "#shared/models/error.model";
import { action, atom } from "@reatom/core";
import { config, ping, updateEvent } from "@repo/shared/constants/sse-events";
import { ConfigEventsData, NotificationsEventsPayload } from "@repo/types/entities/notifications-events-type";
import { toast } from "sonner";

const URL = `${MAIN_BASE_URL}/user/notification/connect`

export const notificationsEsAtom = atom<EventSource | null>(null, "notificationsEs")

notificationsEsAtom.onChange((ctx, state) => {
  if (!state) return;

  state.addEventListener(config, (event) => {
    const data: ConfigEventsData = event.data;

    if (data === 'Exit') {
      state.close();
    }
  })

  state.addEventListener("error", (e) => { 
    throwAppError(ctx, "Notifications is disconnected")
  })

  state.addEventListener(ping, () => { });

  state.addEventListener(updateEvent, (event) => {
    const data: NotificationsEventsPayload = JSON.parse(event.data);

    toast[data.data.status](data.data.message)
  });
})

export const disconnectNotificationsAction = action((ctx) => {
  const current = ctx.get(notificationsEsAtom)
  if (!current) return;

  current.close()
}, "disconnectNotificationsAction")

export const connectNotificationsAction = action((ctx) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;

  notificationsEsAtom(ctx, es(URL))
}, "connectNotificationsAction")