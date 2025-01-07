import { z } from "zod";

export const deleteFriendNoteSchema = z.object({
  recipient: z.string(),
  friend_id: z.string(),
})
