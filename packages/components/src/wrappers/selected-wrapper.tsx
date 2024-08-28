import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes } from 'react';

const selectedWrapperVariants = cva("flex hover:bg-shark-800/60 duration-150 transition-all overflow-hidden rounded-lg", {
  variants: {
    variant: {
      default: "p-2",
    },
    wrapperType: {
      default: "cursor-default",
      action: "cursor-pointer"
    }
  },
  defaultVariants: {
    variant: "default",
  }
})

interface SelectedWrapper
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof selectedWrapperVariants> {
}

export const SelectedWrapper = forwardRef<
 HTMLDivElement, SelectedWrapper
>(({
  className, variant, wrapperType, ...props
}, ref) => {
  return (
    <div ref={ref} className={selectedWrapperVariants(({ variant, className, wrapperType }))} {...props}/>
  )
})