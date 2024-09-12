'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadControl as ThreadControlType, useThreadControl } from '../hooks/use-thread-control.ts';
import { DropdownWrapper } from '../../../../wrappers/dropdown-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Input } from '@repo/ui/src/components/input';
import { currentThreadQuery } from '../queries/current-thread-query.ts';
import { useState } from 'react';
import {
  ThreadRemoveModal,
} from '../../../../modals/action-confirmation/components/thread-remove/components/thread-remove-modal.tsx';
import { THREAD } from '@repo/types/entities/entities-type.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';

type ThreadControlProps = {
  threadId: Pick<ThreadControlType, 'id'>['id']
}

const ThreadControlEdit = ({
  ...currentThread
}: THREAD) => {
  const [ titleValue, setTitleValue ] = useState('');
  const [ descriptionValue, setDescriptionValue ] = useState('');
  const { updateThreadFieldsMutation } = useThreadControl();
  
  if (!currentThread) return;
  
  const handleSaveEditedInfo = (
    type: ThreadControlType['type'],
  ) => {
    const value = type === 'title'
      ? titleValue : type === 'description'
        ? descriptionValue : null;
    
    if (!value) return;
    
    updateThreadFieldsMutation.mutate({
      type: type, id: currentThread.id, title: value,
    });
  };
  
  const isPendingEdit = updateThreadFieldsMutation.isPending || updateThreadFieldsMutation.isError;
  
  return (
    <div className="flex flex-col gap-y-2">
      <Typography textSize="small" className="text-shark-300 px-2 pt-2">
        Редактирование треда
      </Typography>
      <div className="flex flex-col gap-y-2 justify-between">
        <DropdownWrapper
          properties={{
            contentAsChild: true, sideAlign: 'left', contentAlign: 'start',
          }}
          trigger={
            <HoverCardItem>
              Изменить название
            </HoverCardItem>
          }
          content={
            <div className="flex flex-col gap-y-1 items-start w-full">
              <Input
                placeholder={currentThread.title}
                className="rounded-md"
                maxLength={64}
                onChange={(e) => setTitleValue(e.target.value)}
              />
              <Button
                state="default"
                disabled={isPendingEdit}
                pending={isPendingEdit}
                onClick={() => handleSaveEditedInfo('title')}
              >
                Сохранить
              </Button>
            </div>
          }
        />
        <DropdownWrapper
          properties={{ contentAsChild: true, sideAlign: 'left', contentAlign: 'start' }}
          trigger={
            <HoverCardItem>
              Изменить описание
            </HoverCardItem>
          }
          content={
            <div className="flex flex-col gap-y-1 items-start w-full">
              <Input
                placeholder={currentThread.description || 'Описание'}
                className="rounded-md"
                maxLength={96}
                onChange={(e) => setDescriptionValue(e.target.value)}
              />
              <Button
                state="default"
                disabled={isPendingEdit}
                pending={isPendingEdit}
                onClick={() => handleSaveEditedInfo('description')}
              >
                Сохранить
              </Button>
            </div>
          }
        />
        <HoverCardItem>
          Изменить контент
        </HoverCardItem>
        <Separator/>
        <ThreadRemoveModal id={currentThread.id} />
      </div>
    </div>
  );
};

export const ThreadControl = ({
  threadId,
}: ThreadControlProps) => {
  const { data: currentThread } = currentThreadQuery(threadId);
  const { updateThreadFieldsMutation } = useThreadControl();
  
  if (!currentThread) return;
  
  const handleToggleThreadComments = () => {
    updateThreadFieldsMutation.mutate({
        type: 'comments', id: threadId,
        comments: !currentThread.comments || false,
      },
    );
  };
  
  return (
    <div className="flex flex-col items-center px-4 gap-2 w-full">
      <DropdownWrapper
        properties={{ sideAlign: 'left', contentAlign: 'start', contentClassname: "w-[240px]" }}
        trigger={
          <Button className="w-full" state="default">
            Редактировать
          </Button>
        }
        content={<ThreadControlEdit {...currentThread} />}
      />
      <Button
        className="w-full"
        state="default"
        pending={updateThreadFieldsMutation.isPending}
        disabled={updateThreadFieldsMutation.isPending || updateThreadFieldsMutation.isError}
        onClick={handleToggleThreadComments}
      >
        <Typography>
          {currentThread.comments ? 'Выкл. комментарии' : 'Вкл. комментарии'}
        </Typography>
      </Button>
    </div>
  );
};