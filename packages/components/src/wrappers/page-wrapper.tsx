import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { StaticImageData } from "next/image";

const pageWrapperVariants = cva("flex overflow-hidden px-4", {
  variants: {
    variant: {
      default: "h-screen w-full items-center justify-center",
      mini: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface PageWrapperProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageWrapperVariants> {
  withBackground?: {
    src: StaticImageData | string;
  };
}

const PageWrapper = ({
  variant,
  withBackground,
  className,
  ...props
}: PageWrapperProps) => {
  const background = withBackground ? withBackground.src : "none";

  return (
    <div
      className={pageWrapperVariants({ variant, className })}
      style={{
        backgroundImage: `url('${background}')`,
      }}
      {...props}
    />
  );
};

export { PageWrapper };
