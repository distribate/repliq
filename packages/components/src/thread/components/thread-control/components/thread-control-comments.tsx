import { useThreadControl } from '../hooks/use-thread-control.ts';
import { MessageCircle, MessageCircleOff } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadControlFields } from '../types/thread-control-types.ts';
import { Toggle } from '@repo/ui/src/components/toggle.tsx';
import { useState } from 'react';

export const ThreadControlComments = ({
  isComments: currentIsComments,
}: Pick<ThreadControlFields, 'isComments'>) => {
  const [commentsValue, setCommentsValue] = useState<boolean>(currentIsComments)
  const { setThreadNewValuesMutation } = useThreadControl();
  
  const handleToggleThreadComments = () => {
    setCommentsValue(prev => !prev)
    
    return setThreadNewValuesMutation.mutate({
      values: { isComments: !commentsValue }
    });
  };
  
  const disabled = setThreadNewValuesMutation.isPending || setThreadNewValuesMutation.isError;
  
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Typography textColor="gray">Комментарование треда</Typography>
      <Toggle
        variant="outline"
        pressed={commentsValue}
        onPressedChange={handleToggleThreadComments}
        disabled={disabled}
        aria-label="Комментирование"
      >
        {!currentIsComments
          ? <MessageCircleOff size={20} className="text-red-500" />
          : <MessageCircle size={20} className="text-green-500" />
        }
      </Toggle>
    </div>
  );
};