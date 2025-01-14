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