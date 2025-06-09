import { reatomComponent } from "@reatom/npm-react"
import { inputOnClickAction, nicknameAtom, nicknameErrorAtom, passwordAtom, passwordErrorAtom, passwordVisibilityAtom } from "../models/auth.model"
import { Input } from "@repo/ui/src/components/input"
import { HTMLAttributes } from "react"
import { IconKey, IconTag } from "@tabler/icons-react"
import { cva, VariantProps } from "class-variance-authority"
import { Eye, EyeOff } from "lucide-react";

const formFieldVariants = cva("flex items-center justify-start w-full rounded-xl px-4 py-1 bg-shark-900", {
  variants: {
    variant: {
      default: "focus-within:outline focus-within:outline-4 focus-within:outline-green-600",
      error: "outline outline-4 outline-red-600"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type FormFieldProps = VariantProps<typeof formFieldVariants> & HTMLAttributes<HTMLDivElement>

export const FormField = ({ className, variant, ...props }: FormFieldProps) => {
  return <div className={formFieldVariants(({ variant, className }))} {...props} />
}

const PasswordVisibilityBadge = reatomComponent(({ ctx }) => {
  return ctx.spy(passwordVisibilityAtom) === 'text' ? (
    <EyeOff size={20} className='text-shark-300 cursor-pointer' onClick={() => passwordVisibilityAtom(ctx, "password")} />
  ) : (
    <Eye size={20} className='text-shark-300 cursor-pointer' onClick={() => passwordVisibilityAtom(ctx, "text")} />
  )
}, "PasswordVisibilityBadge")

export const PasswordInput = reatomComponent(({ ctx }) => {
  return (
    <FormField className="justify-between" variant={ctx.spy(passwordErrorAtom)}>
      <div className="flex items-center w-full">
        <IconKey size={20} className="font-bold text-shark-300" />
        <Input
          id="password"
          type={ctx.spy(passwordVisibilityAtom)}
          backgroundType="transparent"
          placeholder="пароль"
          autoComplete="new-password"
          onChange={e => passwordAtom(ctx, e.target.value)}
          className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
          autoCorrect="off"
          onClick={() => inputOnClickAction(ctx, "password")}
        />
      </div>
      <PasswordVisibilityBadge />
    </FormField>
  )
}, "PasswordInput")

export const NicknameInput = reatomComponent(({ ctx }) => {
  return (
    <FormField variant={ctx.spy(nicknameErrorAtom)}>
      <IconTag size={20} className="font-bold text-shark-300" />
      <Input
        id="nickname"
        type="text"
        onChange={e => nicknameAtom(ctx, e.target.value)}
        placeholder="логин"
        autoComplete="new-password"
        autoCorrect="off"
        backgroundType="transparent"
        className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
        onClick={() => inputOnClickAction(ctx, "nickname")}
      />
    </FormField>
  )
}, "NicknameInput")