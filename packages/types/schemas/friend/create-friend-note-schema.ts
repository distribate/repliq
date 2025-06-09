import { z } from "zod/v4";

export const addFriendNoteSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  message: z.string(),
})
