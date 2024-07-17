import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = [
  'image/png', 'image/jpg', 'image/jpeg', 'image/webp'
];

const MAX_IMAGE_SIZE = 5; // MB

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

export const createThreadSchema = z.object({
  category: z.string().min(1, {
    message: 'Выберите категорию!',
  }),
  title: z.string().min(4, {
    message: 'Слишком короткий заголовок',
  }).max(64, {
    message: 'Максимум 64 символа',
  }),
  description: z.string().min(5, {
    message: 'Слишком короткое описание',
  }).max(80, {
    message: 'Максимум 80 символов',
  }).or(z.string().max(0)),
  content: z.string().min(36, {
    message: 'Слишком короткое содержание',
  }).max(3128, {
    message: 'Превышено максимальное количество символов',
  }),
  permission: z.boolean(),
  auto_remove: z.boolean(),
  comments: z.boolean(),
  images: z
  .custom<FileList>()
  .optional()
  .refine((files) => {
    return Array.from(files ?? []).every(
      (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE,
    );
  }, `Максимальный размер изображения - ${MAX_IMAGE_SIZE}MB`)
  .refine((files) => {
    return Array.from(files ?? []).every((file) =>
      ACCEPTED_IMAGE_TYPES.includes(file.type),
    );
  }, 'Формат файла не поддерживается.'),
});