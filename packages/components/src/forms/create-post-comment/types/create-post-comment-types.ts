import { z } from "zod";
import { postCommentSchema } from "../schemas/post-comment-schema.ts";

export type createPostCommentInferSchema = z.infer<typeof postCommentSchema>;