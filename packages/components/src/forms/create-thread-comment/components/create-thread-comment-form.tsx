'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useCreateThreadComment } from '../hooks/use-create-thread-comment.tsx';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { SendHorizontal } from 'lucide-react';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { createThreadCommentQuery } from '../queries/create-thread-comment-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '@repo/ui/src/components/input.tsx';
import { CreateThreadCommentFormLayout } from './create-thread-comment-form-layout.tsx';
import { useParams } from "next/navigation"

export const THREAD_COMMENT_MAX_LIMIT = 312;

export const CreateThreadCommentForm = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  const { data: createThreadCommentState } = createThreadCommentQuery();
  const { updateCreateThreadCommentMutation, createThreadCommentMutation } = useCreateThreadComment();
  const [ error, setError ] = useState<'max-limit' | null>(null);
  const params = useParams<{ id: string }>()
  
  if (!currentUser || !createThreadCommentState.values || !params.id) return null;
  
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const content = createThreadCommentState.values?.content;
    if (content && content.length > 2) createThreadCommentMutation.mutate();
  };
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCreateThreadCommentMutation.mutate({ values: { content: e.target.value }, });
  };
  
  useEffect(() => {
    if (params.id) {
      updateCreateThreadCommentMutation.mutate({ threadId: params.id })
    }
  }, [params]);
  
  useEffect(() => {
    const content = createThreadCommentState.values?.content || '';
    
    if (content.length >= THREAD_COMMENT_MAX_LIMIT) {
      setError('max-limit');
    } else if (error && content.length < THREAD_COMMENT_MAX_LIMIT) {
      setError(null);
    } else if (content.length === 0) {
      updateCreateThreadCommentMutation.mutate({ values: { content: undefined } });
    }
  }, [ createThreadCommentState.values?.content ]);
  
  const type = createThreadCommentState.type || 'single';
  const isValid = createThreadCommentState.values.content
    && createThreadCommentState.values.content.length >= 5;
  
  return (
    <CreateThreadCommentFormLayout
      onSubmit={onSubmit}
      variant={type}
      state={createThreadCommentState.formState?.active ? 'active' : 'none'}
    >
      <div className="flex items-center h-full w-full justify-between px-4 py-4">
        <Avatar
          className="self-start min-h-[36px] min-w-[36px]"
          variant="page"
          propWidth={36}
          propHeight={36}
          nickname={currentUser.nickname}
        />
        <div className="flex w-full *:w-full h-fit rounded-md">
          <FormField>
            <Input
              id="content"
              type="text"
              backgroundType="transparent"
              placeholder="Напишите что-нибудь"
              className="w-full min-h-[36px] max-h-[200px]"
              onChange={onChange}
              value={createThreadCommentState.values.content || ""}
              maxLength={THREAD_COMMENT_MAX_LIMIT}
            />
          </FormField>
        </div>
        <Button
          variant="default"
          className="shadow-none bg-transparent border-none p-0 m-0"
          disabled={!isValid || createThreadCommentMutation.isPending}
        >
          <SendHorizontal
            size={26}
            className={isValid ? 'text-caribbean-green-500' : 'text-shark-300'}
          />
        </Button>
      </div>
      {error && (
        <div className="flex px-4 pb-2">
				<span className="text-red-500 text-[15px] font-normal">
					{error === 'max-limit' && 'Вы достигли максимальное кол-во символов'}
				</span>
        </div>
      )}
    </CreateThreadCommentFormLayout>
  );
};