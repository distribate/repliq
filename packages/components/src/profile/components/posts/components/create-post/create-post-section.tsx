'use client';

import { useEffect, useRef } from 'react';
import { PostTextForm } from '../../../../../forms/create-post/components/post-text-form.tsx';
import { usePostFormControl } from '../../../../../forms/create-post/hooks/use-post-form-control.ts';
import { User } from 'lucia';
import { Avatar } from '../../../../../user/components/avatar/components/avatar.tsx';
import { BlockWrapper } from '../../../../../wrappers/block-wrapper.tsx';
import { postFormQuery } from '../../../../../forms/create-post/queries/post-form-query.ts';
import dynamic from 'next/dynamic';

type CreatePostFieldProps = {
  currentUser: User
}

const CreatePostActiveSection = dynamic(() =>
  import('./create-post-active-section.tsx')
  .then(m => m.CreatePostActiveSection),
);

export const CreatePostSection = ({
  currentUser,
}: CreatePostFieldProps) => {
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
  
  const postFieldLength = postFieldStatus.length ? postFieldStatus.length : 0;
  const isActive = postFieldStatus.active || postFieldLength >= 1;
  
  return (
    <BlockWrapper
      ref={postFieldRef}
      backgroundColor="shark_white"
      className="flex-col overflow-hidden h-full"
    >
      <div className="flex items-start h-full w-full gap-4 justify-between py-2">
        <div className="flex gap-2 items-center w-full h-full">
          <Avatar variant="page" propWidth={48} propHeight={48} nickname={currentUser.nickname} />
          <PostTextForm />
        </div>
      </div>
      {isActive && <CreatePostActiveSection />}
    </BlockWrapper>
  );
};