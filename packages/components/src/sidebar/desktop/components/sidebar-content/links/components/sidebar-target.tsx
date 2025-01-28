import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { SIDEBAR_TARGETS } from "../constants/sidebar-targets.ts";
import { useSidebarControl } from "../../../sidebar-layout/hooks/use-sidebar-control.ts";
import { SidebarButton } from "#sidebar/desktop/components/sidebar/sidebar-button.tsx";

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
                <Icon size={20} className="icon-color" />
              </SidebarButton>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex relative w-full h-12">
              <SidebarButton variant={pathname === link ? "active" : "default"} onClick={() => navigate({ to: link })}>
                <Icon size={20} className="icon-color" />
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