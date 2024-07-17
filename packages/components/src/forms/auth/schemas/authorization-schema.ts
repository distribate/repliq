import { z } from "zod";

export const authorizationSchema = z
.object({
	nickname: z.string().trim().min(1, {
		message: "Поле обязательно для заполнения!"
	}).max(32, {
		message: "Ник не содержит больше 32 символов!"
	}),
	password: z.string().trim().min(4, {
		message: "Пароль по умолчанию содержит не менее 4 символов!"
	}).max(32, {
		message: "Пароль не содержит больше 32 символов!"
	})
})

export const registrationSchema = authorizationSchema.and(z
	.object({
		email: z.string().email({
			message:  "Почта обязательна!"
		}),
		acceptRules: z.literal<boolean>(true, {
			errorMap: () => ({
				message: "Вы должны согласиться с правилами, прежде чем авторизовываться"
			})
		}),
		findout: z.string().min(6, {
			message: "Опишите причину подробнее, пожалуйста"
		}).optional().or(z.literal('')),
	})
)