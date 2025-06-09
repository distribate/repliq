import { z } from "zod/v4";

export const deleteFriendNoteSchema = z.object({
  recipient: z.string(),
  friend_id: z.string(),
})
