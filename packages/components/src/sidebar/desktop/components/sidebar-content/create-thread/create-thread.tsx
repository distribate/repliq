import { Pencil } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';
import Link from 'next/link';
import { CREATE_THREAD_URL } from '@repo/shared/constants/routes.ts';

const CreateThreadButton = ({ type }: { type: "compact" | "full"}) => {
  return (
    <Link
      href={CREATE_THREAD_URL}
      className="inline-flex items-center px-4 cursor-pointer py-2.5 rounded-md bg-shark-700 hover:bg-shark-600 group gap-2 w-full justify-start"
    >
      <Pencil size={20} className="text-shark-300" />
      {type === 'full' && (
        <Typography className="text-[15px] font-medium">Создать тред</Typography>
      )}
    </Link>
  );
};

export const CreateThread = () => {
  const { isCompact, isExpanded } = useSidebarControl();
  const isCollapsed = isCompact || !isExpanded;
  
  return (
    <div className="w-full">
      {isCollapsed ? (
        <div className="flex w-[50px] h-[50px]">
          <CreateThreadButton type="compact" />
        </div>
      ) : (
        <div className="flex w-full">
          <CreateThreadButton type="full"/>
        </div>
      )}
    </div>
  );
};