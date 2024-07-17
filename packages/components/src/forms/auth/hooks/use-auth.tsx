import { getUserByNicknameByAUTH, getUserByNicknameByUSERS } from "../queries/get-user-by-nickname.ts";
import { checkServerAuthCredentials } from "@repo/lib/edge-functions/check-user.ts";
import { createSessionAction } from "@repo/lib/actions/create-session.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { mutationOptions } from "@repo/shared/options/mutation-options.ts"
import { createUserSecurityCredentials } from "@repo/lib/actions/create-user-security-credentials.ts";
import { AUTH_QUERY_KEY, AuthQuery } from "../queries/auth-query.ts";
import { createUserAdditionalCredentials } from "@repo/lib/actions/create-user-additional-credentials.ts";

export const useAuth = () => {
	const qc = useQueryClient()
	
	const setAuthValuesMutation = useMutation({
		...mutationOptions,
		mutationFn: async({
			values, type
		}: AuthQuery) => {
			if (!values || !type) return;
			
			const {
				findout,
				password,
				email,
				nickname
			} = values;
			
			const { data: userAUTH } = await getUserByNicknameByAUTH(
				nickname
			)
			
			if (!userAUTH) {
				qc.setQueryData(
					AUTH_QUERY_KEY,
					(prev: AuthQuery) => {
						return { ...prev, formState: { error: "notfound", status: 400 } }
					}
				)
			}
			
			// Если тип авторизации - вход
			if (type === 'signin') {
				if (userAUTH) {
					const {
						data: userUSERS,
						error: getUserByNicknameErr
					} = await getUserByNicknameByUSERS(
						nickname
					)
					
					// Если юзер не найден в таблице зарегистрированных на форуме, но найден в зарегистрированных на сервере
					// то редирект на страницу регистрации и вывод уведомления о существущем юзере.
					if (!userUSERS) {
						qc.setQueryData(
							AUTH_QUERY_KEY,
							(prev: AuthQuery) => {
								return { ...prev, formState: { error: "notfound", status: 400 } }
							}
						)
					}
					
					// Если юзер уже зарегистрирован и вводные данные правильные, то создаем сессию
					if (!getUserByNicknameErr && userUSERS) {
						const error = await createSessionAction({
							nickname: userUSERS.nickname,
							id: userUSERS.id,
							password: password
						})
						
						// Если произошла ошибка при создании сессии, что значит, что введенный пароль юзера
						// неправильный - выводим ошибку о невалидном пароле
						if (error) {
							qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => {
								return { ...prev, formState: { error: "incorrectpass", status: 400, } }
							})
						} else {
							// Очищаем кеш
							await qc.resetQueries({
								queryKey: AUTH_QUERY_KEY
							})
						}
					}
				}
			}
			
			// Если тип авторизации - регистрация
			if (type === "signup") {
				// Fetch registered users from the forum
				const { data: userUSERS } = await getUserByNicknameByUSERS(
					nickname
				);
				
				// If the user already exists in the registered users table
				if (userUSERS) {
					qc.setQueryData(
						AUTH_QUERY_KEY,
						(prev: AuthQuery) => {
							return {
								...prev, formState: { error: "alreadyUsers", status: 400, }
							}
						}
					)
				}
				
				// If the user is not found in the registered users table
				if (!userUSERS) {
					const isCreatedSecurityCred = await createUserSecurityCredentials({
						email, nickname
					});
					
					const isCreatedAddCred = await createUserAdditionalCredentials({
						nickname, findout
					})
					
					if (!isCreatedSecurityCred) {
						qc.setQueryData(
							AUTH_QUERY_KEY,
							(prev: AuthQuery) => {
								return {
									...prev, formState: { error: "something", status: 400 },
								}
							}
						);
					}
					
					// Create a new user with the provided nickname and password
					const { error: checkAndCreateUserErr, status } = await checkServerAuthCredentials({
						nickname, password,
					});
					
					// If user is successfully created, return success notification
					if (status === 204 && isCreatedAddCred) {
						qc.setQueryData(
							AUTH_QUERY_KEY,
							(prev: AuthQuery) => {
								return {
									...prev, formState: { error: "created", status: 204 }
								}
							}
						)
					}
					
					// If there is an error or a 400 status, return the appropriate error
					if (checkAndCreateUserErr || status === 400) {
						qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => {
							return {
								...prev, formState: { error: "incorrectpass", status: 400 }
							}
						})
					}
				}
			}
		},
		onSuccess: async() => {
			await qc.invalidateQueries({
				queryKey: AUTH_QUERY_KEY
			})
		},
		onError: (e) => { throw e }
	})
	
	return { setAuthValuesMutation }
}