"use client"

import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "../schemas/authorization-schema.ts";
import { useEffect } from "react";
import { FormAuthErrorMessage } from "@repo/ui/src/components/form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { zodSignUpForm } from "../types/error-message-type.ts";
import { errorMessages } from "../constants/error-messages.ts";
import { useAuth } from "../hooks/use-auth.tsx";
import { AUTH_QUERY_KEY, AuthQuery, authQuery } from "../queries/auth-query.ts";
import Link from "next/link";
import { GearLoader } from "@repo/ui/src/components/gear-loader.tsx";

const SignUpFormTitle = () => {
	return (
		<div className="flex flex-col items-center gap-y-1">
			<h2 className="text-shark-950 text-4xl font-semibold">
				Регистрация аккаунта
			</h2>
			<Typography textColor="shark_black" textSize="small" className="font-normal">
				(используй свои существующие игровые данные, чтобы зарегистировать аккаунт)
			</Typography>
		</div>
	)
}

export const SignUpForm = () => {
	const { data: authState } = authQuery();
	const { setAuthValuesMutation } = useAuth()
	const { replace } = useRouter()
	const qc = useQueryClient()
	
	const {
		register,
		resetField,
		formState: { errors, isValid },
		handleSubmit,
		reset
	} = useForm<zodSignUpForm>({
		mode: "onChange",
		resolver: zodResolver(registrationSchema),
		defaultValues: {
			password: "",
			nickname: "",
			email: "",
			findout: "",
			acceptRules: false
		}
	});
	
	const error = authState?.formState?.error;
	const status = authState.formState?.status;
	
	useEffect(() => {
		if (status === 204 || error === "notfound") reset()
		
		if (error === "incorrectpass" && status === 400) {
			resetField("password");
		}
	}, [authState?.formState])
	
	const onSubmit = ({
		nickname, password, email, acceptRules, findout
	}: NonNullable<AuthQuery['values']>) => {
		if (!email || !acceptRules) return;
		
		setAuthValuesMutation.mutate({
			type: "signup",
			values: {
				nickname, password, acceptRules, email, findout
			}
		})
	}
	
	const handleRedirect = () => {
		replace("/auth?type=login");
		
		return qc.resetQueries({
			queryKey: AUTH_QUERY_KEY
		})
	}
	
	return (
		<>
			<SignUpFormTitle/>
			<div className="flex flex-col lg:flex-row w-full gap-4 *:w-full *:py-4 *:px-2">
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
					<FormField
						label={{ name: "Никнейм", for: "nickname" }}
						errorMessage={errors?.nickname?.message}
					>
						<Input
							id="nickname"
							type="text"
							placeholder="игровой ник"
							autoComplete="new-password"
							className="!bg-shark-900"
							status={errors.nickname ? 'error' : 'default'}
							variant="minecraft"
							{...register("nickname")}
						/>
					</FormField>
					<FormField
						errorMessage={errors?.password?.message}
						label={{ name: "Пароль", for: "password" }}
					>
						<Input
							id="password"
							type="password"
							className="!bg-shark-900"
							placeholder="игровой пароль"
							autoComplete="new-password"
							status={errors.password ? 'error' : 'default'}
							variant="minecraft"
							{...register("password")}
						/>
					</FormField>
					<FormField
						label={{ name: "Почта", for: "email" }}
						errorMessage={errors?.email?.message}
					>
						<Input
							id="email"
							type="email"
							className="!bg-shark-900"
							placeholder="почта"
							autoComplete="new-password"
							status={errors.password ? 'error' : 'default'}
							variant="minecraft"
							{...register("email")}
						/>
					</FormField>
					<FormField
						label={{ name: "Откуда узнал(-а) о проекте?", for: "findout", optional: true }}
						errorMessage={errors?.findout?.message}
					>
						<Input
							id="findout"
							type="text"
							placeholder="узнал от..."
							autoComplete="new-password"
							className="!bg-shark-900"
							status={errors.nickname ? 'error' : 'default'}
							variant="minecraft"
							{...register("findout")}
						/>
					</FormField>
					<FormField errorMessage={errors?.acceptRules?.message}>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="rules" {...register("acceptRules")}/>
							<Typography textSize="medium" textColor="shark_black">
								Согласен с&nbsp;
								<Link
									href={`/misc/rules`}
									target="_blank"
									className="underline underline-offset-4"
								>
									правилами
								</Link>
								&nbsp;пользования
							</Typography>
						</div>
					</FormField>
					<div className="flex items-center gap-x-2">
						<Button
							variant='minecraft'
							disabled={!isValid || setAuthValuesMutation.isPending}
						>
							<span className="text-shark-50 text-md uppercase font-semibold">
								Зарегистрироваться
							</span>
						</Button>
						{setAuthValuesMutation.isPending && <GearLoader/>}
					</div>
					{error && <FormAuthErrorMessage type={error} messages={errorMessages}/>}
					{error === 'created' && (
						<div className="px-2">
							<Typography variant="link" textSize="medium" textColor="shark_black" onClick={handleRedirect}>
								Перейти к авторизации
							</Typography>
						</div>
					)}
				</form>
				<div className="flex flex-col mt-6 gap-y-4">
					<Typography textShadow="small" textSize="medium" textColor="shark_black" className="font-normal">
						Зарегистрируйся на форуме, чтобы создавать свой контент и с общаться с игроками в одной сети!
					</Typography>
					<div className="flex flex-col gap-y-1">
						<Typography textShadow="small" textSize="medium" className="font-semibold text-red-800">
							Внимание!
						</Typography>
						<Typography textShadow="small" textSize="medium" textColor="shark_black" className="font-normal">
							Никнейм чувствителен к регистру, иначе ты должен вводить игровой ник точь-в-точь с заглавными буквами
							(если они есть).
						</Typography>
					</div>
					<div className="w-full overflow-hidden">
						<Typography onClick={handleRedirect} textColor="shark_black" textSize="medium" variant="link">
							У меня уже есть аккаунт. Войти.
						</Typography>
					</div>
				</div>
			</div>
		</>
	)
}