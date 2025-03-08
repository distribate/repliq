import { THREAD_CONTENT_LIMIT_DEFAULT, THREAD_DESCRIPTION_LIMIT, THREAD_TITLE_LIMIT } from "../../../shared/constants/limits";
import { z } from "zod";

export const threadTitleSchema = z
  .string()
  .min(THREAD_TITLE_LIMIT[0], { message: "Слишком короткий заголовок", })
  .max(THREAD_TITLE_LIMIT[1], { message: "Слишком длинный заголовок", })

export const threadDescriptionSchema = z
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
    { message: "Слишком длинное описание" },
  )
  .nullable()

export const threadTagsSchema = z.string().array().nullable()

export const threadPermissionSchema = z.boolean()

export const threadContentSchema = z
  .string()
  .min(THREAD_CONTENT_LIMIT_DEFAULT[0], { message: "Слишком короткое содержание", })
  .max(THREAD_CONTENT_LIMIT_DEFAULT[2], { message: "Превышено максимальное количество символов", })

export const threadContentFormDataSchema = z
  .string()
  .min(THREAD_CONTENT_LIMIT_DEFAULT[0], { message: "Слишком короткое содержание", })
  .max(THREAD_CONTENT_LIMIT_DEFAULT[2], { message: "Превышено максимальное количество символов", })

export const threadImagesSchema = z.instanceof(Uint8Array).array().nullable();

export const threadIsCommentsSchema = z.boolean()

export const threadCategorySchema = z.number().min(1, { message: "Выберите категорию!" })

export const threadVisibilitySchema = z.enum(["all", "friends"])

export const createThreadSchema = z.object({
  title: threadTitleSchema,
  description: threadDescriptionSchema,
  category_id: threadCategorySchema,
  content: threadContentFormDataSchema,
  tags: threadTagsSchema,
  permission: threadPermissionSchema,
  is_comments: threadIsCommentsSchema,
  images: threadImagesSchema,
  visibility: threadVisibilitySchema,
})