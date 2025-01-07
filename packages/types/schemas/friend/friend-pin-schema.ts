import { z } from "zod";

export const friendPinSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  type: z.enum(["pin", "unpin"])
})