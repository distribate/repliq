import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, HTMLAttributes } from "react"

const sidebarButtonVariants = cva("inline-flex duration-100 ease-in-out transition cursor-pointer items-center px-4 py-1 gap-x-4 rounded-md w-full justify-start", {
  variants: {
    variant: {
      default: "border-2 border-transparent bg-shark-800 hover:bg-shark-600",
      active: "border-2 border-biloba-flower-500 bg-biloba-flower-500/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type SidebarButtonProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarButtonVariants>

export const SidebarButton = forwardRef<HTMLDivElement, SidebarButtonProps>(({
  variant, className, ...props
}, ref) => {
  return <div className={sidebarButtonVariants({ variant, className })} {...props} ref={ref} />
})