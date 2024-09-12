import { Button } from '@repo/ui/src/components/button.tsx';
import { Pencil } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useRouter } from 'next/navigation';
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';

const CreateThreadButton = ({ type }: { type: "compact" | "full"}) => {
  const { replace } = useRouter();
  
  return (
    <Button
      className="group gap-2 w-full justify-start bg-shark-800"
      onClick={() => { replace('/create-thread'); }}
    >
      <Pencil size={18} className="group-hover:text-pink-500 text-shark-300" />
      {type === 'full' && (
        <Typography textSize="small">Создать тред</Typography>
      )}
    </Button>
  );
};

export const CreateThread = () => {
  const { isCompact, isExpanded } = useSidebarControl();
  
  return (
    <div className="w-full">
      {isCompact || !isExpanded ? (
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