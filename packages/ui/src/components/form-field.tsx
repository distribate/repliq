import { forwardRef, HTMLAttributes } from "react";
import { Typography } from "./typography.tsx";

const FieldErrorMessage = ({ message }: { message?: string }) => {
	return (
		<span className="text-red-600 text-sm font-normal">
			{message}
		</span>
	)
}

interface FormFieldProps
	extends HTMLAttributes<HTMLDivElement> {
	label?: {
		name: string,
		for: string,
		optional?: boolean
	},
	errorMessage?: string
}

const FormField = forwardRef<
	HTMLDivElement, FormFieldProps
>((
	{
		className,
		errorMessage,
		label,
		children,
		...props
	},
	ref
) => {
	return (
		<div ref={ref} className="flex flex-col gap-y-1" {...props}>
			{label && (
				<>
					<label htmlFor={label.for}/>
					<Typography
						className={`text-md font-medium text-shark-800`}
						textShadow="small"
					>
						{label.name} {label.optional && ' (опционально)'}
					</Typography>
				</>
			)}
			{children}
			{errorMessage && (
				<FieldErrorMessage message={errorMessage}/>
			)}
		</div>
	)
})
FormField.displayName = "FormField"

export { FormField }