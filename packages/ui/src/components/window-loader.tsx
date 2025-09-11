import { cva, VariantProps } from "class-variance-authority"
import { HTMLAttributes } from "react"

const windowLoaderVariants = cva("windows-loading-spinner", {
  variants: {
    size: {
      default: "w-12 h-12",
      small: "w-6 h-6"
    }
  },
  defaultVariants: {
    size: "default"
  }
})

type WindowLoaderProps = HTMLAttributes<HTMLOrSVGElement> 
  & VariantProps<typeof windowLoaderVariants>

export const WindowLoader = ({
  size, className, ...props
}: WindowLoaderProps) => {
  return (
    <svg
      viewBox="0 0 16 16"
      height="48"
      width="48"
      className={windowLoaderVariants({ size, className })}
      {...props}
    >
      <circle r="7px" cy="8px" cx="8px"></circle>
    </svg>
  )
}