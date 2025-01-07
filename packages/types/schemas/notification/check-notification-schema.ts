import { z } from "zod";

export const checkNotificationSchema = z.object({
  notification_id: z.string(),
});
