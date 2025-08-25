import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@repo/shared/utils/cn.ts";
import { ComponentPropsWithoutRef } from "react";

const Separator = ({
  className, orientation = "horizontal", decorative = true, ...props
}: ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-shark-600",
      orientation === "horizontal"
        ? "h-[1px] w-full"
        : "h-full min-h-[16px] w-[1px]",
      className,
    )}
    {...props}
  />
)

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };