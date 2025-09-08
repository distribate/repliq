import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { action, atom } from "@reatom/core";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { config, ping, updateEvent } from "@repo/shared/constants/sse-events";
import { ConfigEventsData, NotificationsEventsPayload } from "@repo/types/entities/notifications-events-type";
import { toast } from "sonner";

const URL = `${import.meta.env.PUBLIC_ENV__API_PREFIX_URL}/user/notification/connect`

export const es = (url: string) => new EventSource(url, { withCredentials: true });

const notificationsEsAtom = atom<EventSource | null>(null, "notificationsEs")

notificationsEsAtom.onChange((_, state) => {
  if (!state) return;

  state.addEventListener(config, (event) => {
    const data: ConfigEventsData = event.data;

    if (data === 'Exit') {
      state.close();
    }
  })

  state.addEventListener(ping, () => { });

  state.addEventListener(updateEvent, (event) => {
    const data: NotificationsEventsPayload = JSON.parse(event.data);

    toast[data.data.status](data.data.message)
  });
})

export const disconnectNotificationsSSE = action((ctx) => {
  const current = ctx.get(notificationsEsAtom)
  if (!current) return;
  current.close()
}, "disconnectNotificationsSSE")

export const initNotificationsSSE = action((ctx) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;
  notificationsEsAtom(ctx, es(URL))
}, "initNotificationsSSE")

export const Notifications = reatomComponent(({ ctx }) => {
  useUpdate(initNotificationsSSE, [])
  return null;
}, "Notifications")