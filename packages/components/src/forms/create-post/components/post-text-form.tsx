import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostFormControl } from "../hooks/use-post-form-control.ts";
import { postSchema } from "../schemas/post-field-schema.ts";
import { Textarea } from "@repo/ui/src/components/textarea.tsx";
import { postFormQuery } from "../queries/post-form-query.ts";
import { createPostFormInferSchema } from "../types/create-post-form-types.ts";

export const PostTextForm = () => {
	const { postFormFieldsMutation } = usePostFormControl()
	const { data: fieldQuery } = postFormQuery()
	
	const {
		register,
		getValues,
		reset
	} = useForm<createPostFormInferSchema>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			content: "", visibility: fieldQuery.visibility || "all"
		}
	});
	
	const formLength = fieldQuery.length;
	
	return (
		<form className="w-full overflow-hidden max-h-[200px] h-full">
			<Textarea
				id="content"
				value={fieldQuery.content || ''}
				placeholder="Что нового?"
				maxLength={300}
				className={`!text-base resize-none ${formLength && formLength >= 60 && 'focus:resize-y'}`}
				onClick={() => postFormFieldsMutation.mutate({
					active: true
				})}
				{...register("content", {
					onChange: () => {
						postFormFieldsMutation.mutate({
							length: getValues("content").length,
							content: getValues("content")
						})
					},
					maxLength: 300,
					value: fieldQuery.content,
					pattern: /^(?!.* {3}).*$/i
				})}
			/>
		</form>
	)
}