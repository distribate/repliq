'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { currentThreadQuery } from '../queries/current-thread-query.ts';
import {
  ThreadRemoveModal,
} from '#modals/action-confirmation/components/thread-remove/components/thread-remove-modal.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ThreadControlProps } from '../types/thread-control-types.ts';
import { ThreadControlTitle } from './thread-control-title.tsx';
import { ThreadControlDescription } from './thread-control-description.tsx';
import { ThreadControlContent } from './thread-control-content.tsx';
import { ThreadControlComments } from './thread-control-comments.tsx';

export const ThreadControlMain = ({
  id: threadId,
}: Pick<ThreadControlProps, 'id'>) => {
  const { data: currentThread } = currentThreadQuery(threadId);
  
  if (!currentThread) return null;
  
  return (
    <div className="flex flex-col gap-y-4 p-4 w-full">
      <Typography textSize="very_big">
        {currentThread.title} <span className="text-shark-400 text-lg">(редактирование)</span>
      </Typography>
      <div className="flex flex-col gap-y-4 justify-between">
        <ThreadControlTitle id={currentThread.id} title={currentThread.title} />
        <Separator />
        <ThreadControlDescription id={currentThread.id} description={currentThread.description} />
        <Separator />
        <ThreadControlContent id={currentThread.id} content={currentThread.content} />
        <Separator />
        <ThreadControlComments id={currentThread.id} comments={currentThread.comments} />
        <Separator />
        <ThreadRemoveModal id={currentThread.id} />
      </div>
    </div>
  );
};