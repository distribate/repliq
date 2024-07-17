import * as React from "react"

import { cn } from "@repo/lib/utils/ui/cn.ts"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[48px] w-full rounded-md border-none bg-transparent
           px-4 py-1 text-sm ring-offset-background placeholder:text-shark-300
            focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed
             disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
