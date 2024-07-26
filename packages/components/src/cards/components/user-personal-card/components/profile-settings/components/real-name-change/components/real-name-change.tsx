import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { useDialog } from "@repo/lib/hooks/use-dialog.ts";
import { useQueryClient } from '@tanstack/react-query';
import { realNameSchema } from '../schemas/real-name-schema.ts';
import { REAL_NAME_CHANGE_MODAL_NAME } from '../../../../../../../../modals/user-settings/real-name-change-modal.tsx';

export type zodRealNameInfer = z.infer<typeof realNameSchema>;

export const RealNameChange = () => {
	const qc = useQueryClient()
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
	const { updateFieldMutation } = useUpdateCurrentUser()
	const { removeDialogMutation } = useDialog()
	
	const { register, formState: { errors, isValid }, getValues, watch } = useForm<zodRealNameInfer>({
		resolver: zodResolver(realNameSchema),
		mode: "onChange",
		defaultValues: { name: currentUser?.real_name || '' }
	})
	
	const value = watch("name")
	const isIdentity = value === currentUser?.real_name;
	
	const handleRealName = () => {
		if (!currentUser) return;
		
		const value = getValues("name")
		
		updateFieldMutation.mutate({
			field: "real_name", value: value
		})
		
		if (isIdentity) return;
		
		removeDialogMutation.mutate(REAL_NAME_CHANGE_MODAL_NAME)
	}
	
	if (!currentUser) return;
	
	return (
		<div className="flex flex-col items-center gap-y-4 w-full">
			<Typography variant="dialogTitle">Смена реального имени</Typography>
			<div className="flex items-center justify-start w-full gap-1 px-4">
				<Typography>Текущее имя:</Typography>
				<Typography textShadow="small" textSize="medium" textColor="shark_white">
					{currentUser.real_name}
				</Typography>
			</div>
			<Separator/>
			<div className="flex flex-col gap-y-2 w-full">
				<FormField>
					<Input
						placeholder="например: Абоба"
						className="!text-base"
						maxLength={25}
						backgroundType="transparent"
						{...register("name", { maxLength: 25 })}
					/>
					{errors?.name && <span className="text-red-500 text-sm px-4">{errors.name.message}</span>}
				</FormField>
				<Button
					pending={updateFieldMutation.isPending}
					disabled={updateFieldMutation.isPending || !isValid || isIdentity}
					onClick={handleRealName}
				>
					<Typography textColor="shark_white">Сохранить</Typography>
				</Button>
			</div>
		</div>
	)
}