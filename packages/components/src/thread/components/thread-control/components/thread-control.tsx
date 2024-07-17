'use client';

import { BlockWrapper } from '../../../../wrappers/block-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadControl as ThreadControlType, useThreadControl } from '../hooks/use-thread-control.ts';
import { DropdownWrapper } from '../../../../wrappers/dropdown-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { DialogWrapper } from '../../../../wrappers/dialog-wrapper.tsx';
import {
  ThreadRemoveModal,
} from '../../../../modals/action-confirmation/components/thread-remove/components/thread-remove-modal.tsx';
import { Input } from '@repo/ui/src/components/input';
import { currentThreadQuery } from '../queries/current-thread-query.ts';
import { useState } from 'react';

export const ThreadControl = ({
  id: thread_id,
}: Pick<ThreadControlType, 'id'>) => {
  const [ titleValue, setTitleValue ] = useState('');
  const [ descriptionValue, setDescriptionValue ] = useState('');
  const { data: currentThread } = currentThreadQuery(thread_id);
  
  const { updateThreadFieldsMutation } = useThreadControl();
  
  return (
    <BlockWrapper className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4 py-2 w-full">
        <Typography
          textSize="big"
          className="font-semibold"
          textColor="shark_white"
        >
          Управление тредом
        </Typography>
        <div className="flex items-center gap-2 w-full *:w-full">
          <DropdownWrapper
            properties={{ sideAlign: 'left', contentAlign: 'start', }}
            trigger={
              <Button
              
              >
                Редактировать
              </Button>
            }
            content={
              <div className="flex flex-col gap-y-2 justify-between">
                <DropdownWrapper
                  properties={{ contentAsChild: true, sideAlign: 'left', contentAlign: 'start', }}
                  trigger={
                    <HoverCardItem
                    
                    >
                      <Typography>Изменить название</Typography>
                    </HoverCardItem>
                  }
                  content={
                    <div className="flex flex-col gap-y-1 items-start w-full">
                      <Input
                        placeholder={currentThread?.title}
                        className="rounded-md"
                        maxLength={64}
                        onChange={(e) => setTitleValue(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          updateThreadFieldsMutation.mutate({
                            type: 'title', id: thread_id, title: titleValue,
                          });
                        }}
                      >
                        Сохранить
                      </Button>
                    </div>
                  }
                />
                <DropdownWrapper
                  properties={{ contentAsChild: true, sideAlign: 'left', contentAlign: 'start', }}
                  trigger={
                    <HoverCardItem>
                      <Typography>
                        Изменить описание
                      </Typography>
                    </HoverCardItem>
                  }
                  content={
                    <div className="flex flex-col gap-y-1 items-start w-full">
                      <Input
                        placeholder={currentThread?.description}
                        className="rounded-md"
                        maxLength={96}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          updateThreadFieldsMutation.mutate({
                            type: 'description', id: thread_id, description: descriptionValue,
                          });
                        }}
                      >
                        Сохранить
                      </Button>
                    </div>
                  }
                />
                <HoverCardItem
                
                >
                  <Typography>Изменить контент</Typography>
                </HoverCardItem>
              </div>
            }
          />
          <DialogWrapper
            name="remove-thread"
            trigger={
              <Button
              
              >
                Удалить
              </Button>
            }
          >
            <ThreadRemoveModal id={thread_id} />
          </DialogWrapper>
          <Button onClick={() => {
            updateThreadFieldsMutation.mutate({
              type: 'comments', id: thread_id,
              comments: !currentThread?.comments || false,
            });
          }}>
            <Typography>
              {currentThread?.comments ? 'Выкл. комментарии' : 'Вкл. комментарии'}
            </Typography>
          </Button>
        </div>
      </div>
    </BlockWrapper>
  );
};