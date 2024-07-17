import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { useDialog } from "@repo/lib/hooks/use-dialog.ts";

const realNameSchema = z.object({
	name: z.string().min(2, {
		message: "Минимум 2 символа"
	}).max(24, {
		message: "Максимум 24 символа"
	})
})

export type zodRealNameInfer = z.infer<typeof realNameSchema>;

export const RealNameChange = () => {
	const { data: currentUser } = currentUserQuery();
	const { updateFieldMutation } = useUpdateCurrentUser()
	const { removeDialogMutation } = useDialog()
	
	const {
		register,
		formState: { errors },
		getValues,
		watch
	} = useForm<zodRealNameInfer>({
		resolver: zodResolver(realNameSchema),
		mode: "onChange",
		defaultValues: {
			name: currentUser?.real_name || ''
		}
	})
	
	const handleRealName = () => {
		const value = getValues("name")
		
		updateFieldMutation.mutate({
			field: "real_name",
			value: value
		})
		
		removeDialogMutation.mutate({
			dialogName: "real-name-change"
		})
	}
	
	const value = watch("name")
	
	return (
		<div className="flex flex-col gap-y-4 w-full">
			<div className="px-4">
				<Typography textShadow="small" textSize="medium" textColor="shark_white">
					{value}
				</Typography>
			</div>
			<Separator/>
			<div className="flex flex-col gap-y-2 w-full">
				<FormField>
					<Input
						placeholder="например: Абоба"
						className="!text-base"
						maxLength={24}
						backgroundType="transparent"
						{...register("name", {
							maxLength: 24
						})}
					/>
					{errors?.name && (
						<span className="text-red-500 text-sm">{errors.name.message}</span>
					)}
				</FormField>
				<Button
					onClick={handleRealName}
				>
					<Typography textColor="shark_white">
						Сохранить
					</Typography>
				</Button>
			</div>
		</div>
	)
}