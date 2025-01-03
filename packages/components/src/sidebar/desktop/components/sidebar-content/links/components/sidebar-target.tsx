import { Typography } from "@repo/ui/src/components/typography.tsx";
import { usePathname } from "next/navigation";
import { SIDEBAR_TARGETS } from "../constants/sidebar-targets.ts";
import { useSidebarControl } from "../../../sidebar-layout/hooks/use-sidebar-control.ts";
import Link from "next/link";

const SidebarTargetDecoration = () => {
  return (
    <div
      className="absolute -right-1 bg-gradient-to-br
       from-biloba-flower-300 to-biloba-flower-500 w-[4px] rounded-3xl h-full"
    />
  )
}

export const SidebarTarget = () => {
  const pathname = usePathname();
  const { isCompact, isExpanded } = useSidebarControl();
  const isCollapsed = isCompact || !isExpanded;

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {SIDEBAR_TARGETS.map(({ link, title, icon: Icon }) => (
        <div key={title} className="w-full">
          {isCollapsed && (
            <div className="flex relative w-[50px] h-[50px]">
              <Link
                href={link}
                className="inline-flex items-center px-4 py-1 rounded-md bg-shark-800 hover:bg-shark-700 w-full justify-start"
              >
                <Icon size={20} className="text-shark-300" />
              </Link>
              {pathname === link && <SidebarTargetDecoration/>}
            </div>
          )}
          {!isCollapsed && (
            <div className="flex relative w-full h-12">
              <Link
                href={link}
                className="inline-flex items-center px-4 py-1 rounded-md bg-shark-800 hover:bg-shark-700 gap-4 w-full justify-start"
              >
                <Icon size={20} className="text-shark-300" />
                <Typography className="text-[16px] font-medium">
                  {title}
                </Typography>
              </Link>
              {pathname === link && <SidebarTargetDecoration/>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
