import { useThreadControl } from '../hooks/use-thread-control.ts';
import { Button } from '@repo/ui/src/components/button.tsx';
import { MessageCircle, MessageCircleOff } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadControlProps } from '../types/thread-control-types.ts';

export const ThreadControlComments = ({
  id: threadId, comments: currentComments,
}: Pick<ThreadControlProps, 'id' | 'comments'>) => {
  const { updateThreadFieldsMutation } = useThreadControl();
  
  const handleToggleThreadComments = () => {
    return updateThreadFieldsMutation.mutate({
      type: 'comments', id: threadId, comments: !currentComments,
    });
  };
  
  const buttonDisabled = updateThreadFieldsMutation.isPending || updateThreadFieldsMutation.isError;
  
  return (
    <Button
      className="w-fit"
      state="default"
      disabled={buttonDisabled}
      onClick={handleToggleThreadComments}
    >
      <div className="flex items-center gap-2">
        {!currentComments
          ? <MessageCircleOff size={20} className="text-red-500" />
          : <MessageCircle size={20} className="text-green-500" />
        }
        <Typography>Комментарии</Typography>
      </div>
    </Button>
  );
};