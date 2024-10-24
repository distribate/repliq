import { useState } from 'react';
import { useThreadControl } from '../hooks/use-thread-control.ts';
import { Input } from '@repo/ui/src/components/input.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadControlProps } from '../types/thread-control-types.ts';

export const ThreadControlTitle = ({
  id: threadId, title: currentTitle,
}: Pick<ThreadControlProps, "id" | "title">) => {
  const [ titleValue, setTitleValue ] = useState('');
  const { updateThreadFieldsMutation } = useThreadControl();
  
  const handleSaveEditedInfo = () => {
    return updateThreadFieldsMutation.mutate({
      type: 'title', id: threadId, title: titleValue,
    });
  };
  
  const isPendingEdit = updateThreadFieldsMutation.isPending || updateThreadFieldsMutation.isError;
  const isIdentity = !titleValue || titleValue === currentTitle
  
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        placeholder={currentTitle}
        roundedType="default"
        maxLength={64}
        value={titleValue}
        onChange={e => setTitleValue(e.target.value)}
      />
      <Button
        state="default"
        disabled={isPendingEdit || isIdentity}
        pending={isPendingEdit}
        onClick={handleSaveEditedInfo}
      >
        Сохранить
      </Button>
    </div>
  );
};