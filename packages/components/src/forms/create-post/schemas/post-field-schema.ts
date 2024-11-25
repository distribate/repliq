import { z } from "zod";

export const postSchema = z.object({
	user: z.string(),
	content: z.string(),
	visibility: z.enum(["only", "all", "friends"])
})