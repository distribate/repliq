"use client"

import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { forwardRef, ReactNode, useCallback } from "react";
import { DialogContentProps, DialogProps } from "@radix-ui/react-dialog";
import { useDialog } from "@repo/lib/hooks/use-dialog.ts";
import { dialogParamsQuery } from "@repo/lib/queries/dialog-params-query.ts";

interface DialogContentExtended
	extends DialogContentProps {}

interface DialogWrapperProps extends DialogProps {
	trigger: ReactNode;
	children: ReactNode;
	asChild?: boolean;
	triggerClassName?: string;
	properties?: Partial<{
		dialogContentClassName: string;
		dialogTriggerClassName: string
	}>;
	name: string;
	dialog?: DialogContentExtended;
}

export const DialogWrapper = forwardRef<
	HTMLDivElement,
	DialogWrapperProps
>((
	{
		trigger,
		children,
		asChild,
		name,
		properties = {
			dialogTriggerClassName: "",
			dialogContentClassName: ""
		},
		dialog,
		...dialogProps
	}, ref
) => {
	const { setDialogIdMutation, removeDialogMutation } = useDialog()
	const { data: dialogParams } = dialogParamsQuery()
	
	const isDialogOpen = useCallback((
		dialogName: string | null
	) => {
		if (!dialogName) return false;
		
		return dialogParams.some(dialog => dialog.id === dialogName)
	}, [ dialogParams ]);
	
	const handleDialogState = useCallback((
		open: boolean
	) => {
		if (!name) return;
		
		if (open) {
			setDialogIdMutation.mutate({
				dialogName: name
			})
		} else {
			removeDialogMutation.mutate({
				dialogName: name
			})
		}
	}, [ name, setDialogIdMutation, removeDialogMutation ])
	
	return (
		<Dialog
			open={isDialogOpen(name)}
			onOpenChange={(open: boolean) => handleDialogState(open)}
			{...dialogProps}
		>
			<DialogTrigger asChild={asChild} className={properties?.dialogTriggerClassName}>
				{trigger}
			</DialogTrigger>
			<DialogContent
				ref={ref}
				className={properties?.dialogContentClassName}
				{...dialog}
			>
				{children}
			</DialogContent>
		</Dialog>
	)
})