import { z } from 'zod';

export const createSessionBodySchema = z.object({
  details: z.object({
    nickname: z.string(),
    password: z.string().min(4),
  }),
  info: z.object({
    browser: z.string().nullable(),
    cpu: z.string().nullable(),
    ip: z.string().nullable(),
    isBot: z.boolean().nullable(),
    os: z.string().nullable(),
    ua: z.string().nullable(),
    device: z.string().nullable(),
  }),
});

export const nicknameSchema = z
  .string()
  .min(1, { message: "Поле обязательно для заполнения!" })
  .max(16, { message: "Ник не содержит больше 16 символов!" })
  .regex(/^[^\u0400-\u04FF]*$/, { message: "Ник содержит недопустимые символы" })

export const passwordSchema = z
  .string()
  .min(4, { message: "Пароль не должен содержать менее 4 символов" })
  .max(32, { message: "Пароль не должен превышать 32 символа" })

export const registerSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
  details: z.object({
    realName: z.string().or(z.null()),
    findout: z.string(),
    referrer: z.string().optional()
  })
})