import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { SIDEBAR_TARGETS } from "../constants/sidebar-targets.ts";
import { useSidebarControl } from "../../../sidebar-layout/hooks/use-sidebar-control.ts";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const sidebarButtonVariants = cva("inline-flex cursor-pointer items-center px-4 py-1 gap-x-4 rounded-md w-full justify-start", {
  variants: {
    variant: {
      default: "border border-shark-700 bg-shark-800 hover:bg-shark-700",
      active: "border border-biloba-flower-500 bg-biloba-flower-500/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type SidebarButtonProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarButtonVariants>

export const SidebarButton = ({
  variant,
  className,
  ...props
}: SidebarButtonProps) => {
  return <div className={sidebarButtonVariants({ variant, className })} {...props} />
}

export const SidebarTarget = () => {
  const { pathname } = useLocation()
  const { isCompact, isExpanded } = useSidebarControl();
  const isCollapsed = isCompact || !isExpanded;
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {SIDEBAR_TARGETS.map(({ link, title, icon: Icon }) => (
        <div key={title} className="w-full">
          {isCollapsed && (
            <div className="flex relative w-[50px] h-[50px]">
              <SidebarButton variant={pathname === link ? "active" : "default"} onClick={() => navigate({ to: link })}>
                <Icon size={20} className="text-shark-300" />
              </SidebarButton>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex relative w-full h-12">
              <SidebarButton variant={pathname === link ? "active" : "default"} onClick={() => navigate({ to: link })}>
                <Icon size={20} className="text-shark-300" />
                <Typography className="text-[16px] font-medium">
                  {title}
                </Typography>
              </SidebarButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
