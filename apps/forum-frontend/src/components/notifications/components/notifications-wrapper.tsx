import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { reatomComponent } from "@reatom/npm-react";
import { isProduction } from "@repo/lib/helpers/is-production";
import { config, ping, updateEvent } from "@repo/shared/constants/sse-events";
import { ConfigEventsData, NotificationsEventsPayload } from "@repo/types/entities/notifications-events-type";
import { useEffect } from "react";
import { toast } from "sonner";

const NOTIFICATIONS_SSE_URL = isProduction ? "https://api.fasberry.su/forum/sse" : "http://localhost:4101/forum/sse"

export const es = (url: string) => new EventSource(url, {
  withCredentials: true
});

export const NotificationsWrapper = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  useEffect(() => {
    if (!isAuthenticated) return;

    const eventSource = es(NOTIFICATIONS_SSE_URL)

    eventSource.addEventListener(config, (event) => {
      const data: ConfigEventsData = event.data;

      if (data === 'Exit') {
        eventSource.close();
      }
    })

    eventSource.addEventListener(ping, () => { });

    eventSource.addEventListener(updateEvent, (event) => {
      const data: NotificationsEventsPayload = JSON.parse(event.data);

      toast[data.data.status](data.data.message)
    });

    return () => eventSource.close();
  }, [isAuthenticated])

  return null;
}, "NotificationsWrapper")