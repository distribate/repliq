import { z } from "zod";
import { postSchema } from "../schemas/post-field-schema.ts";

export type createPostFormInferSchema = z.infer<typeof postSchema>;