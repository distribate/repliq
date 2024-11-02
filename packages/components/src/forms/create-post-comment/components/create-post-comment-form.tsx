import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { usePostCommentsFormControl } from "../hooks/use-post-comments-form-control.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "../schemas/post-comment-schema.ts";
import { createPostCommentInferSchema } from "../types/create-post-comment-types.ts";
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export type PostItemFooterProps = {
	post_id: string
}

export const CreatePostCommentForm = ({
	post_id
}: PostItemFooterProps) => {
	const currentUser = getUser();
	const { updatePostCommentFieldMutation, createPostCommentMutation } = usePostCommentsFormControl()

	const { register, handleSubmit, getValues, reset, formState: { errors, isValid } } = useForm<createPostCommentInferSchema>({
		resolver: zodResolver(postCommentSchema),
		defaultValues: { content: "" }
	});
	
	const onSubmit = () => {
		reset();
		createPostCommentMutation.mutate(post_id)
	}
	
	if (!currentUser) return null;
	
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-row gap-2 items-center justify-between"
		>
			<Avatar
				variant="page"
				propWidth={36}
				propHeight={36}
				nickname={currentUser.nickname}
			/>
			<div className="flex w-full border-[1px] border-white/10 *:w-full rounded-lg">
				<FormField errorMessage={errors?.content?.message}>
					<Input
						placeholder="Комментировать"
						maxLength={128}
						backgroundType="transparent"
						{...register("content", {
							maxLength: 128,
							onChange: () => {
								updatePostCommentFieldMutation.mutate({
									post_id: post_id,
									content: getValues("content"),
									length: getValues("content").length
								})
							}
						})}
					/>
				</FormField>
			</div>
			<Button
				disabled={createPostCommentMutation.isPending || !isValid}
				variant="default"
				className="shadow-none bg-transparent w-fit border-none p-0 m-0"
			>
				{!createPostCommentMutation.isPending && (
					<SendHorizontal size={26} className="text-shark-300"/>
				)}
			</Button>
		</form>
	)
}