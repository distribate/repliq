import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useRouter } from 'next/navigation';
import { SIDEBAR_TARGETS } from '../constants/sidebar-targets.ts';
import { useSidebarControl } from '../../../sidebar-layout/hooks/use-sidebar-control.ts';

export const SidebarTarget = () => {
  const { replace } = useRouter();
  const { isCompact, isExpanded } = useSidebarControl();
  
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {SIDEBAR_TARGETS.map(target => (
        <div key={target.title} className="w-full">
          {isCompact || !isExpanded ? (
            <div className="flex w-[50px] h-[50px]">
              <Button
                border="default"
                className="group gap-2 w-full justify-start"
                onClick={() => { replace(target.link) }}
              >
                <target.icon size={18} className="group-hover:text-pink-500 transition-all ease-in text-shark-300" />
              </Button>
            </div>
          ) : (
            <div className="flex w-full">
              <Button
                border="default"
                onClick={() => {replace(target.link);}}
                className="group gap-2 w-full justify-start"
              >
                <target.icon size={18} className="group-hover:text-pink-500 transition-all ease-in text-shark-300" />
                <Typography textSize="small">
                  {target.title}
                </Typography>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};