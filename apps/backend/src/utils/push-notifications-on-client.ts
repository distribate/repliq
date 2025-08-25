import { getNatsConnection } from "@repo/config-nats/nats-client"
import { updateEvent } from "@repo/shared/constants/sse-events"
import type { NotificationsEventsPayload } from "@repo/types/entities/notifications-events-type.ts"

type FriendData = {
  initiator: string,
  recipient: string
}

type EventData =
  | { event: "create-friend-request" | "accept-friend-request", data: FriendData }
  | { event: "global", data: { message: string } }

export const pushNotificationOnClient = ({
  event, data
}: EventData) => {
  const nc = getNatsConnection()

  let payload: NotificationsEventsPayload | null = null;
  let payloadData: NotificationsEventsPayload["data"] | null = null;

  switch (event) {
    case "create-friend-request":
      payloadData = { message: `Игрок ${data.initiator} хочет добавить вас в друзья`, status: "info" }
      break;
    case "accept-friend-request":
      payloadData = { message: `Игрок ${data.initiator} принял вашу заявку в друзья`, status: "success" }
      break;
    case "global":
      payloadData = { message: data.message, status: "info" }
      break;
    default:
      break;
  }

  if (payloadData) {
    switch (event) {
      case "global":
        payload = { event, data: payloadData }
        break;
      case "accept-friend-request":
      case "create-friend-request":
        payload = { event, data: payloadData, for: data.recipient }
        break;
      default:
        break;
    }

    return nc.publish(updateEvent, JSON.stringify(payload));
  } else {
    throw new Error("Payload is null, unable to publish notification.");
  }
}