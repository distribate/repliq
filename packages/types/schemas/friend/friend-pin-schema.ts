import { z } from "zod/v4";

export const friendPinSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  type: z.enum(["pin", "unpin"])
})