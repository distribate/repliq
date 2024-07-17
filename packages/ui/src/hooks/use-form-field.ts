import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { createContext, useContext } from "react";
import { AuthMessages, ErrorMessageMap } from "@repo/components/src/forms/auth/types/error-message-type.ts";

export function getFormErrorMessage(type: AuthMessages, errorMessages: ErrorMessageMap): string {
	if (type === null) {
		return ""
	} else {
		return errorMessages[type]
	}
}

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
	name: TName
}

export const FormFieldContext = createContext<FormFieldContextValue>(
	{} as FormFieldContextValue
)

type FormItemContextValue = {
	id: string
}

export const FormItemContext = createContext<FormItemContextValue>(
	{} as FormItemContextValue
)

export const useFormField = () => {
	const fieldContext = useContext(FormFieldContext)
	const itemContext = useContext(FormItemContext)
	const { getFieldState, formState } = useFormContext()

	const fieldState = getFieldState(fieldContext.name, formState)

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>")
	}

	const { id } = itemContext

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	}
}