import { ErrorMessageMap } from "../types/error-message-type.ts";

export const errorMessages: ErrorMessageMap = {
	notfound: "Такой игрок не зарегистрирован",
	incorrectpass: "Неверный ник или пароль",
	something: "Что-то пошло не так. Повторите попытку позже",
	created: "Аккаунт создан! Теперь вы можете войти в свой аккаунт.",
	alreadyServer: "Аккаунт найден на сервере, но не на форуме. Зарегистрируйтесь на форуме!",
	alreadyUsers: "Такой аккаунт уже зарегистрирован!"
};