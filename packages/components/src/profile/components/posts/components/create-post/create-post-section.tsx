'use client';

import { useEffect, useRef } from 'react';
import { PostTextForm } from '#forms/create-post/components/post-text-form.tsx';
import { usePostFormControl } from '#forms/create-post/hooks/use-post-form-control.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import dynamic from 'next/dynamic';
import { getUser } from '@repo/lib/helpers/get-user.ts';

const CreatePostActiveSection = dynamic(() =>
  import('./create-post-active-section.tsx')
  .then(m => m.CreatePostActiveSection),
);

export const CreatePostSection = () => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const postFieldRef = useRef<HTMLDivElement | null>(null);
  const { postFormFieldsMutation } = usePostFormControl();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postFieldRef.current) {
        const target = event.target as Node;
        
        if (postFieldRef.current.contains(target)) return;
        
        postFormFieldsMutation.mutate({ isActive: false });
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ postFieldRef ]);
  
  return (
    <BlockWrapper
      ref={postFieldRef}
      backgroundColor="shark_black"
      className="flex-col overflow-hidden h-full"
    >
      <div className="flex items-start h-full w-full gap-2 justify-between">
        <div className="flex gap-2 items-start w-full h-full">
          <Avatar
            variant="page"
            propWidth={48}
            propHeight={48}
            nickname={currentUser.nickname}
          />
          <div className="flex w-full overflow-hidden *:w-full relative h-full">
            <PostTextForm />
          </div>
        </div>
      </div>
      <CreatePostActiveSection />
    </BlockWrapper>
  );
};