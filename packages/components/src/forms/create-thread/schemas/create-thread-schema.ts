import { z } from "zod";
import {
  THREAD_CONTENT_LIMIT_DEFAULT,
  THREAD_DESCRIPTION_LIMIT,
  THREAD_TITLE_LIMIT,
} from "@repo/shared/constants/limits.ts";
import { getContentLimit } from "#forms/create-thread/hooks/use-create-thread.tsx";

export const createThreadSchema = z
  .object({
    category: z.string().min(1, {
      message: "Выберите категорию!",
    }),
    title: z
      .string()
      .min(THREAD_TITLE_LIMIT[0], {
        message: "Слишком короткий заголовок",
      })
      .max(THREAD_TITLE_LIMIT[1], {
        message: "Максимум 64 символа",
      }),
    description: z
      .string()
      .transform((val) => (val.length > 1 ? val : undefined))
      .refine(
        (val) =>
          typeof val === "undefined" ||
          val.length >= THREAD_DESCRIPTION_LIMIT[0],
        { message: "Слишком короткое описание" },
      )
      .refine(
        (val) =>
          typeof val === "undefined" ||
          val.length <= THREAD_DESCRIPTION_LIMIT[1],
        { message: "Максимум 80 символов" },
      )
      .optional(),
    content: z
      .string()
      .min(THREAD_CONTENT_LIMIT_DEFAULT[0], {
        message: "Слишком короткое содержание",
      })
      .max(THREAD_CONTENT_LIMIT_DEFAULT[2], {
        message: "Превышено максимальное количество символов",
      }),
    permission: z.boolean(),
    auto_remove: z.boolean(),
    comments: z.boolean(),
    images: z.custom<File[] | null>(),
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
