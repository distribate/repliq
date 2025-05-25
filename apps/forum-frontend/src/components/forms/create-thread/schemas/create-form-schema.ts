import { z } from "zod";
import { 
  threadCategorySchema, threadContentSchema, threadDescriptionSchema, 
  threadTitleSchema, threadVisibilitySchema 
} from "@repo/types/schemas/thread/create-thread-schema";
import { getContentLimit } from "../models/create-thread.model";

export const createThreadSchema = z
  .object({
    title: threadTitleSchema,
    content: threadContentSchema,
    description: threadDescriptionSchema,
    category_id: threadCategorySchema,
    images: z.custom<File[] | null>(),
    is_comments: z.boolean(),
    tags: z.array(z.string()).nullable(),
    permission: z.boolean(),
    visibility: threadVisibilitySchema,
  })
  .superRefine((data, ctx) => {
    const contentLimit = getContentLimit(data.images);

    if (data.content.length > contentLimit) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: `Превышено максимальное количество символов (${contentLimit})`,
      });
    }
  });