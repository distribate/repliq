import React, { useState } from 'react';
import { Input } from '@repo/ui/src/components/input.tsx';
import { ThreadControlFields } from '../types/thread-control-types.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Info } from 'lucide-react';
import { useThreadControl } from '#thread/components/thread-control/hooks/use-thread-control.ts';

export const ThreadControlDescription = ({
  description: currentDescription,
}: Pick<ThreadControlFields, 'description'>) => {
  const { setThreadNewValuesMutation } = useThreadControl()
  const [ descriptionValue, setDescriptionValue ] = useState(currentDescription || "");
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setDescriptionValue(value)
    
    setThreadNewValuesMutation.mutate({
      values: { description: value }
    })
  }
  
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex flex-col w-full pt-2 pb-1 border border-shark-700 rounded-md">
        <div className="flex items-center gap-1 px-4">
          <Typography textColor="gray">Описание</Typography>
          <Info size={14} className="text-shark-300" />
        </div>
        <Input
          placeholder={currentDescription || 'Введите описание'}
          roundedType="default"
          value={descriptionValue}
          backgroundType="transparent"
          className="!text-[16px]"
          maxLength={96}
          onChange={onChange}
        />
      </div>
    </div>
  );
};