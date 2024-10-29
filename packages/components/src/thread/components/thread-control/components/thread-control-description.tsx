import { useState } from 'react';
import { useThreadControl } from '../hooks/use-thread-control.ts';
import { Input } from '@repo/ui/src/components/input.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadControlProps } from '../types/thread-control-types.ts';

export const ThreadControlDescription = ({
  id: threadId, description: currentDescription,
}: Pick<ThreadControlProps, "id" | "description">) => {
  const [ descriptionValue, setDescriptionValue ] = useState('');
  const { updateThreadFieldsMutation } = useThreadControl();
  
  const handleSaveEditedInfo = () => {
    return updateThreadFieldsMutation.mutate({
      type: 'description',
      id: threadId,
      description: descriptionValue
    });
  };
  
  const isPendingEdit = updateThreadFieldsMutation.isPending || updateThreadFieldsMutation.isError;
  const isIdentity = !descriptionValue || descriptionValue === currentDescription
  
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        placeholder={currentDescription || 'Введите описание'}
        roundedType="default"
        value={descriptionValue}
        maxLength={96}
        onChange={(e) => setDescriptionValue(e.target.value)}
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