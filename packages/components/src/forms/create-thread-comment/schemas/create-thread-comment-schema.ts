import { z } from "zod";

export const createThreadCommentSchema = z.object({
	content: z.string()
	.min(1, {
		message: ""
	})
	.max(128, {
		message: ""
	})
})