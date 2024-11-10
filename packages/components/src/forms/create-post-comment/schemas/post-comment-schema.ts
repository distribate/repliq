import { z } from "zod";

export const postCommentSchema = z.object({
	content: z.string().min(2, {
		message: "Слишком мало контента"
	}).max(128, {
		message: "Слишком много символов"
	})
})