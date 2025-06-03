import { z } from 'zod';
import { isProduction } from "../../../lib/helpers/is-production";

export const createSessionBodySchema = z.object({
  nickname: z.string(),
  password: z.string().min(4),
  browser: z.string().nullable(),
  cpu: z.string().nullable(),
  os: z.string().nullable(),
  ua: z.string().nullable(),
  device: z.string().nullable(),
  token: isProduction ? z.string() : z.string().optional()
});

export const nicknameSchema = z
  .string()
  .min(1, { message: "Поле обязательно для заполнения!" })
  .max(16, { message: "Ник не содержит больше 16 символов!" })
  .regex(/^[^\u0400-\u04FF]*$/, { message: "Ник содержит недопустимые символы" })
  .regex(/^\S*$/, {
    message: "Ник не должен содержать пробельные символы (пробелы, табы и т.д.)",
  });

export const passwordSchema = z
  .string()
  .min(4, { message: "Пароль не должен содержать менее 4 символов" })
  .max(32, { message: "Пароль не должен превышать 32 символа" })
  .regex(/^\S*$/, {
    message: "Пароль не должен содержать пробельные символы (пробелы, табы и т.д.)",
  });
  
export const registerSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
  token: isProduction ? z.string() : z.string().optional(),
  findout: z.string(),
  referrer: z.string().optional()
})