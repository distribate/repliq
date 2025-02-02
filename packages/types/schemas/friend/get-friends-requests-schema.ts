import { z } from "zod";

export const getFriendsRequestSchema = z.object({
  type: z.enum(["incoming", "outgoing"]),
  cursor: z.string().optional()
});