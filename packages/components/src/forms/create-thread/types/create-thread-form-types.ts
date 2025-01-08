import { z } from "zod";
import { Control, FieldErrors } from "react-hook-form";
import { threadCategorySchema, threadContentSchema, threadDescriptionSchema, threadTagsSchema, threadTitleSchema, threadVisibilitySchema } from "@repo/types/schemas/thread/create-thread-schema";
import { getContentLimit } from "../hooks/use-create-thread";

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

export type zodCreateThreadForm = z.infer<typeof createThreadSchema>;

export type FormChildsProps = {
  control: Control<zodCreateThreadForm, any>;
  errors: FieldErrors<zodCreateThreadForm>;
};