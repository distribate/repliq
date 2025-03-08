import type { SSEEvents } from "@repo/types/entities/notifications-events-type.ts"

export const updateEvent: SSEEvents = "notifications:update"
export const ping: SSEEvents = "ping"
export const config: SSEEvents = 'config'