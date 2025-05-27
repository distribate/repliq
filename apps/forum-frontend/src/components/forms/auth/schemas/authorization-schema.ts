import { nicknameSchema, passwordSchema } from "@repo/types/schemas/auth/create-session-schema";
import { z } from "zod";

export const authorizationSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
  // token: isProduction ? z.string() : z.string().optional()
});

export const registrationSchema = authorizationSchema.and(z.object({
  acceptRules: z.literal<boolean>(true, {
    errorMap: () => ({ message: "Вы должны согласиться с правилами, прежде чем авторизовываться", }),
  }),
  findout: z
    .string()
    .min(2, { message: "Опишите причину подробнее, пожалуйста", })
    .max(128),
  // referrer: z.string().min(1).optional(),
  // token: isProduction ? z.string() : z.string().optional(),
}));