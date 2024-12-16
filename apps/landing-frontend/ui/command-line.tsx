import { cn } from "#/lib/utils/cn"
import { VariantProps, cva } from "class-variance-authority"
import { HTMLAttributes } from 'react';

const commandLineVariants = cva("p-1 inline-flex", {
  variants: {
    variant: {
      default: "px-2 py-1 border border-neutral-500 dark:border-neutral-700 rounded-md bg-neutral-600 dark:bg-neutral-800"
    },
    padding: {
      normal: "px-4 py-2",
      big: "px-6 py-4",
    },
  },
  defaultVariants: {
    variant: "default"
  }
})

export interface CommandLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandLineVariants> {}

export const CommandLine = ({
  className, variant, padding, children, ...props
}: CommandLineProps) => {
  return (
    <div className={cn(commandLineVariants({ variant, padding }), className)} {...props}>
      <span className="text-white">{children}</span>
    </div>
  )
}