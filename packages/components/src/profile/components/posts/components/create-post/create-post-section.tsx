'use client';

import { useEffect, useRef } from 'react';
import { PostTextForm } from '#forms/create-post/components/post-text-form.tsx';
import { usePostFormControl } from '#forms/create-post/hooks/use-post-form-control.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import { postFormQuery } from '#forms/create-post/queries/post-form-query.ts';
import dynamic from 'next/dynamic';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

const CreatePostActiveSection = dynamic(() =>
  import('./create-post-active-section.tsx')
  .then(m => m.CreatePostActiveSection),
);

export const CreatePostSection = () => {
  const qc = useQueryClient()
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  const postFieldRef = useRef<HTMLDivElement | null>(null);
  const { postFormFieldsMutation } = usePostFormControl();
  const { data: postFieldStatus } = postFormQuery();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postFieldRef.current) {
        const target = event.target as Node;
        
        if (postFieldRef.current.contains(target)) return;
        
        postFormFieldsMutation.mutate({ active: false });
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ postFieldRef ]);
  
  const postFieldLength = postFieldStatus.length
    ? postFieldStatus.length
    : 0;
  
  const isActive = postFieldStatus.active || postFieldLength >= 1;
  
  if (!currentUser) return;
  
  return (
    <BlockWrapper
      ref={postFieldRef}
      backgroundColor="shark_white"
      className="flex-col overflow-hidden h-full"
    >
      <div className="flex items-start h-full w-full gap-2 justify-between">
        <div className="flex gap-2 items-center w-full h-full">
          <Avatar
            variant="page"
            propWidth={48}
            propHeight={48}
            nickname={currentUser.nickname}
          />
          <PostTextForm />
        </div>
      </div>
      {isActive && <CreatePostActiveSection />}
    </BlockWrapper>
  );
};