import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/shared/utils/cn";

const toggleVariants = cva(
  `inline-flex items-center justify-center rounded-lg text-sm font-medium
   transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50
   data-[state=off]:bg-shark-800 data-[state=off]:text-shark-50 data-[state=on]:bg-shark-50 data-[state=on]:text-shark-800`,
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-shark-700/20 bg-transparent",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants };