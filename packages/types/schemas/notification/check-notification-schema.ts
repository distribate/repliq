import { z } from "zod/v4";

export const checkNotificationSchema = z.object({
  notification_id: z.string(),
});
