import { z } from "zod/v4";

export const deleteFriendSchema = z.object({
  friend_id: z.string(),
})