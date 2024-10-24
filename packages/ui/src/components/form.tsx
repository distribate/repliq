import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider } from "react-hook-form"
import { cn } from "@repo/lib/utils/ui/cn.ts"
import { Label } from "./label.tsx"
import { FormFieldContext, FormItemContext, getFormErrorMessage, useFormField } from "../hooks/use-form-field";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes, useId } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { AuthMessages, ErrorMessageMap } from "@repo/components/src/forms/auth/types/error-message-type.ts";

const Form = FormProvider

const formAuthErrorMessageVariants = cva("text-md font-normal [text-shadow:_1px_1px_0_rgb(0_0_0_/_10%)]", {
  variants: {
    variant: {
      error: "text-red-600",
      success: "text-green-600"
    }
  },
  defaultVariants: {
    variant: "error"
  }
})

interface ErrorFieldProps extends HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof formAuthErrorMessageVariants> {
  message: string;
}

const ErrorField = ({ variant, className, message, ...props }: ErrorFieldProps) => {
  return (
    <span className={formAuthErrorMessageVariants({ variant, className })} {...props}>
      {message}
    </span>
  )
}

const FormAuthErrorMessage = ({
  type,
  messages
}: {
  type: AuthMessages,
  messages: ErrorMessageMap
}) => {
  const errorMessage = getFormErrorMessage(type, messages);

  return (
    <div className="py-0.5 px-2">
			<ErrorField
        message={errorMessage}
        variant={type === 'created' ? 'success' : type === 'alreadyOriginal' ? 'success' : 'error'}
      />
    </div>
  )
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({
  className,
  ...props
}, ref) => {
  const id = useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({
  className,
  ...props
}, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({
  ...props
}, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({
  className,
  ...props
}, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({
  className,
  children,
  ...props
}, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) return null

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export { FormAuthErrorMessage, useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }