import { z } from "zod";
import { POST_CONTENT_LIMIT } from '@repo/shared/constants/limits.ts';

export const postSchema = z.object({
	content: z.string().min(POST_CONTENT_LIMIT[0]).max(POST_CONTENT_LIMIT[1]),
	visibility: z.enum(["only", "all", "friends"])
})