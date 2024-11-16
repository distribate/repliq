import React, { useState } from 'react';
import { Input } from '@repo/ui/src/components/input.tsx';
import { ThreadControlFields } from '../types/thread-control-types.ts';
import { Info } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useThreadControl } from '#thread/components/thread-control/hooks/use-thread-control.ts';

export const ThreadControlTitle = ({
  title: currentTitle,
}: Pick<ThreadControlFields, 'title'>) => {
  const [ titleValue, setTitleValue ] = useState<string>(currentTitle);
  const { setThreadNewValuesMutation } = useThreadControl()
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setTitleValue(value)
    setThreadNewValuesMutation.mutate({
      values: { title: value }
    })
  }
  
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex flex-col w-full pt-2 pb-1 border border-shark-700 rounded-md">
        <div className="flex items-center gap-1 px-4">
          <Typography textColor="gray">Название</Typography>
          <Info size={14} className="text-shark-300" />
        </div>
        <Input
          placeholder={currentTitle}
          roundedType="default"
          backgroundType="transparent"
          className="!text-[16px]"
          maxLength={64}
          value={titleValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
};