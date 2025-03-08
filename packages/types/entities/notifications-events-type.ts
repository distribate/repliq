export type NotificationsEventsPayload = {
  event: NotifyEvents,
  for?: string,
  data: {
    message: string,
    status: "info" | "success"
  }
}

export type NotifyEvents =
  | "create-friend-request"
  | "accept-friend-request"
  | "news"
  | "alert"
  | "login"
  | "global"

export type ConfigEventsData = "Established" | "Exit"

export type SSEEvents = "notifications:update" | "ping" | "config"