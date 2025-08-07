import * as z from "zod";

export const deleteFriendSchema = z.object({
  friend_id: z.string(),
})