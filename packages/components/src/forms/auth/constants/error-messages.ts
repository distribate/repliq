import { ErrorMessageMap } from "../types/error-message-type.ts";

export const errorMessages: ErrorMessageMap = {
	notFound: "Такой игрок не зарегистрирован",
	incorrectPassword: "Неверный ник или пароль",
	something: "Что-то пошло не так. Повторите попытку позже",
	created: "Аккаунт создан! Теперь вы можете войти в свой аккаунт.",
	alreadyOriginal: "Аккаунт найден на сервере, но не на форуме. Зарегистрируйтесь на форуме!",
	alreadyForum: "Такой аккаунт уже зарегистрирован!"
};