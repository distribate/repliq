import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useRouter, usePathname } from 'next/navigation';
import { SIDEBAR_TARGETS } from '../constants/sidebar-targets.ts';
import { useSidebarControl } from '../../../sidebar-layout/hooks/use-sidebar-control.ts';

export const SidebarTarget = () => {
  const { replace } = useRouter();
  const pathname = usePathname()
  const { isCompact, isExpanded } = useSidebarControl();
  
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {SIDEBAR_TARGETS.map(target => (
        <div key={target.title} className="w-full">
          {isCompact || !isExpanded ? (
            <div className="flex relative w-[50px] h-[50px]">
              <Button
                state="default"
                className="group gap-2 w-full justify-start"
                onClick={() => { replace(target.link) }}
              >
                <target.icon size={20} className="group-hover:text-pink-500 transition-all ease-in text-shark-300" />
              </Button>
              {pathname === target.link && (
                <div
                  className="absolute -right-1 bg-gradient-to-br from-biloba-flower-300 to-biloba-flower-500 w-[4px] rounded-3xl h-full"
                />
              )}
            </div>
          ) : (
            <div className="flex relative w-full h-12">
              <Button
                state="default"
                onClick={() => {replace(target.link)}}
                className="group gap-2 w-full justify-start"
              >
                <target.icon size={20} className="group-hover:text-pink-500 transition-all ease-in text-shark-300" />
                <Typography className="text-[14px] font-medium">
                  {target.title}
                </Typography>
              </Button>
              {pathname === target.link && (
                <div
                  className="absolute -right-4 bg-gradient-to-br from-biloba-flower-300 to-biloba-flower-500 w-[4px] rounded-3xl h-full"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};