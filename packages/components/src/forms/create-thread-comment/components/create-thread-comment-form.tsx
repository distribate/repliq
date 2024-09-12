"use client"

import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import {
	zodCreateThreadComment
} from "../types/create-thread-comment-types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createThreadCommentSchema
} from "../schemas/create-thread-comment-schema.ts";
import {
	useCreateThreadComment
} from "../hooks/use-create-thread-comment.tsx";
import { Avatar } from "../../../user/components/avatar/components/avatar.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Textarea } from "@repo/ui/src/components/textarea.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import {
	createThreadCommentQuery
} from "../queries/create-thread-comment-query.ts";
import { useQueryClient } from '@tanstack/react-query';

const createThreadCommentFormVariants = cva(
	"flex flex-col border-white/10 bg-shark-950 overflow-hidden w-full h-full", {
		variants: {
			variant: {
				single: "rounded-md border-[1px]",
				reply: "rounded-b-md border-b-[1px]"
			}
		},
		defaultVariants: {
			variant: "single"
		}
	}
)

interface CreateThreadCommentFormProps
	extends HTMLAttributes<HTMLFormElement>,
	VariantProps<typeof createThreadCommentFormVariants> {}

const Form = forwardRef<
	HTMLFormElement, CreateThreadCommentFormProps
>(({
	className, variant, ...props
}, ref) => {
	return (
		<form
			ref={ref}
			className={createThreadCommentFormVariants(({ className, variant }))}
			{...props}
		/>
	)
})

type CreateThreadCommentProps = {
	thread_id: string
}

export const CreateThreadCommentForm = ({
	thread_id
}: CreateThreadCommentProps) => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	const { data: createThreadCommentState } = createThreadCommentQuery()
	
	const {
		updateCreateThreadCommentMutation,
		createThreadCommentMutation
	} = useCreateThreadComment()
	
	const {
		register,
		handleSubmit,
		getValues,
		formState: { isValid }
	} = useForm<zodCreateThreadComment>({
		mode: "onChange",
		resolver: zodResolver(createThreadCommentSchema),
		defaultValues: { content: "" }
	});
	
	const onSubmit = () => {
		createThreadCommentMutation.mutate(thread_id)
	}
	
	if (!createThreadCommentState || !currentUser) return null;
	
	const type = createThreadCommentState.type || "single";
	
	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
			variant={type}
		>
			<div className="flex items-center gap-2 h-full w-full justify-between px-4 py-4">
				<Avatar
					className="self-start min-h-[48px] min-w-[48px]"
					variant="page"
					propWidth={48}
					propHeight={48}
					nickname={currentUser.nickname}
				/>
				<div className="flex w-full *:w-full rounded-md">
					<FormField>
						<Textarea
							id="content"
							placeholder="Напишите что-нибудь"
							className="w-full h-[48px] max-h-[200px] py-2"
							maxLength={128}
							{...register("content", {
								onChange: () => {
									updateCreateThreadCommentMutation.mutate({
										values: { content: getValues("content") }
									})
								}
							})}
						/>
					</FormField>
				</div>
				<Button
					type="submit"
					variant="default"
					className="shadow-none bg-transparent border-none p-0 m-0"
					disabled={!isValid || createThreadCommentMutation.isPending}
				>
					<SendHorizontal
						size={26}
						className="text-shark-300"
					/>
				</Button>
			</div>
		</Form>
	)
}