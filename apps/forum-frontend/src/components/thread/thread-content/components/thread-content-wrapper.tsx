import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, HTMLAttributes } from "react"

export const threadContentWrapperVariants = cva("flex px-4 max-w-full h-full rounded-none", {
  variants: {
    variant: {
      default: "bg-shark-800",
      readonly: ""
    }
  },
  defaultVariants: {
    variant: "readonly"
  }
})

type ThreadContentWrapperProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof threadContentWrapperVariants>

const ThreadContentWrapper = forwardRef<HTMLDivElement, ThreadContentWrapperProps>(({
  variant, className, ...props
}, ref) => {
  return <div ref={ref} className={threadContentWrapperVariants({ variant, className })} {...props} />
})

ThreadContentWrapper.displayName = "ThreadContentWrapper"

export { ThreadContentWrapper }