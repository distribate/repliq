import { isProduction } from "@repo/lib/helpers/is-production";
import { globalOptionQuery } from "@repo/lib/queries/global-option-query";
import { config, ping, updateEvent } from "@repo/shared/constants/sse-events";
import { ConfigEventsData, NotificationsEventsPayload } from "@repo/types/entities/notifications-events-type";
import { useEffect } from "react";
import { toast } from "sonner";

const URL = isProduction ? "https://cc.fasberry.su/api/forum/sse" : "http://localhost:4101/api/forum/sse"

export const NotificationsWrapper = () => {
  const { isAuthenticated } = globalOptionQuery().data

  useEffect(() => {
    if (isAuthenticated) {
      const es = new EventSource(URL, { withCredentials: true });

      // es.onopen = () => console.log(">>> Connection opened!");

      es.addEventListener(config, (event) => {
        const data: ConfigEventsData = event.data;

        if (data === 'Exit') es.close();
      })

      es.addEventListener(ping, () => { });

      es.addEventListener(updateEvent, (event) => {
        const data: NotificationsEventsPayload = JSON.parse(event.data);

        toast[data.data.status](data.data.message)
      });

      return () => es.close();
    }
  }, [isAuthenticated])

  return <></>
}