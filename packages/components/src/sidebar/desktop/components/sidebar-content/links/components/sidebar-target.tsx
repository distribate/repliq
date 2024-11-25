import { Typography } from '@repo/ui/src/components/typography.tsx';
import { usePathname } from 'next/navigation';
import { SIDEBAR_TARGETS } from '../constants/sidebar-targets.ts';
import { useSidebarControl } from '../../../sidebar-layout/hooks/use-sidebar-control.ts';
import Link from 'next/link';

export const SidebarTarget = () => {
  const pathname = usePathname();
  const { isCompact, isExpanded } = useSidebarControl();
  const isCollapsed = isCompact || !isExpanded;
  
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {SIDEBAR_TARGETS.map(target => (
        <div key={target.title} className="w-full">
          {isCollapsed && (
            <div className="flex relative w-[50px] h-[50px]">
              <Link
                href={target.link}
                className="inline-flex items-center px-4 cursor-pointer
                py-1 rounded-md bg-shark-800 hover:bg-shark-700 group gap-2 w-full justify-start"
              >
                <target.icon size={20} className="text-shark-300" />
              </Link>
              {pathname === target.link && (
                <div
                  className="absolute -right-1 bg-gradient-to-br
                   from-biloba-flower-300 to-biloba-flower-500 w-[4px] rounded-3xl h-full"
                />
              )}
            </div>
          )}
          {!isCollapsed && (
            <div className="flex relative w-full h-12">
              <Link
                href={target.link}
                className="inline-flex items-center hover:bg-shark-800 px-4 cursor-pointer
                py-1 rounded-md border border-shark-700 group gap-2 w-full justify-start"
              >
                <target.icon size={20} className="text-shark-300" />
                <Typography className="text-[14px] font-medium">
                  {target.title}
                </Typography>
              </Link>
              {pathname === target.link && (
                <div
                  className="absolute -right-4 bg-gradient-to-br
                   from-biloba-flower-300 to-biloba-flower-500 w-[4px] rounded-3xl h-full"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};