import { z } from "zod";
import { createThreadCommentSchema } from "../schemas/create-thread-comment-schema.ts";

export type zodCreateThreadComment = z.infer<typeof createThreadCommentSchema>