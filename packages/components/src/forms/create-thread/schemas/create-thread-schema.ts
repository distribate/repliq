import { z } from 'zod';

export const THREAD_CONTENT_LIMIT = 4096;

export const createThreadSchema = z.object({
  category: z.string().min(1, {
    message: 'Выберите категорию!',
  }),
  title: z.string().min(4, {
    message: 'Слишком короткий заголовок',
  }).max(64, {
    message: 'Максимум 64 символа',
  }),
  description: z.string()
  .transform(val => (val.length < 1 ? undefined : val))
  .refine(
    val => typeof val === "undefined" || val.length >= 5,
    { message: "Слишком короткое описание" }
  )
  .refine(
    val => typeof val === "undefined" || val.length <= 80,
    { message: "Максимум 80 символов" }
  )
  .optional(),
  content: z.string().min(36, {
    message: 'Слишком короткое содержание',
  }).max(THREAD_CONTENT_LIMIT, {
    message: 'Превышено максимальное количество символов',
  }),
  permission: z.boolean(),
  auto_remove: z.boolean(),
  comments: z.boolean(),
  images: z
  .custom<File[] | null>(),
});