import { nicknameSchema, passwordSchema } from "@repo/types/schemas/auth/create-session-schema";
import { z } from "zod";

export const authorizationSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema
});

export const registrationSchema = authorizationSchema.and(z.object({
  // email: z.string().email({
  // 	message:  "Почта обязательна!"
  // }),
  realName: z
    .string()
    .min(1, { message: "Имя должно быть не менее 2 символов", })
    .max(32, { message: "Имя должно быть не более 32 символов", })
    .or(z.literal("")),
  acceptRules: z.literal<boolean>(true, {
    errorMap: () => ({ message: "Вы должны согласиться с правилами, прежде чем авторизовываться", }),
  }),
  findout: z
    .string()
    .min(2, { message: "Опишите причину подробнее, пожалуйста", })
    .max(128),
  referrer: z.string().min(1).optional(),
}));