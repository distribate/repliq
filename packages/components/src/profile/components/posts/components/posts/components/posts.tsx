'use client';

import { PostItemHeader } from '#post/components/post-item/components/post-header/post-header.tsx';
import { PostItemBody } from '#post/components/post-item/components/post-body/post-body.tsx';
import { PostItemFooter } from '#post/components/post-item/components/post-footer/post-footer.tsx';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { postsQuery } from '../queries/posts-query.ts';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import { UserPostsSkeleton } from '#skeletons/user-posts-skeleton.tsx';
import dynamic from 'next/dynamic';
import { PostComments } from './post-comments.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FilteringSearch } from '#filtering/components/filtering-search.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import React, { ChangeEvent, forwardRef, useCallback, useState } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';

const ContentNotFound = dynamic(() =>
  import('#templates/section-not-found.tsx')
  .then(m => m.ContentNotFound),
);

const SomethingError = dynamic(() =>
  import('#templates/something-error.tsx')
  .then(m => m.SomethingError),
);

type PostsProps = {
  nickname: string,
  name_color: string
}

const PostsFiltering = forwardRef<
  HTMLInputElement
>((props, ref) => {
  const [ value, setValue ] = useState('');
  
  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
  
  }, 100), []);
  
  const handleSearchInput = (e: ChangeEvent<
    HTMLInputElement
  >) => {
    const { value } = e.target;
    
    setValue(value);
    debouncedHandleSearch(value);
  };
  
  return (
    <Input
      ref={ref}
      className="rounded-lg"
      value={value}
      placeholder="Поиск по названию"
      onChange={handleSearchInput}
      {...props}
    />
  );
})

const POSTS_SORT_ITEMS = [
  {
    title: "По дате публикации",
    value: "created_at"
  }
]

export const Posts = ({
  nickname, name_color,
}: PostsProps) => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  const { data: posts, isError, isLoading } = postsQuery(nickname);
  
  if (isLoading) return <UserPostsSkeleton />;
  if (isError) return <SomethingError />;
  
  if (!posts
    || posts && !posts.length
  ) return <ContentNotFound title="Постов не найдено." />;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" className="text-lg font-semibold">
            Посты
          </Typography>
          <Typography textSize="medium" className="text-shark-300">
            (всего {posts?.length})
          </Typography>
        </div>
        <div className="flex items-center gap-4 w-fit">
          <FilteringSearch>
            <PostsFiltering/>
          </FilteringSearch>
          <div className="w-fit">
            <DropdownWrapper
              properties={{
                sideAlign: "bottom",
                contentAlign: "end",
                contentClassname: "w-[200px]"
              }}
              trigger={
                <div className="flex items-center gap-1">
                  <Typography className="text-shark-300" textSize="medium">
                    {POSTS_SORT_ITEMS[0].title}
                  </Typography>
                </div>
              }
              content={
                <div className="flex flex-col gap-y-4">
                  <Typography className="text-shark-300 text-sm px-2 pt-2">
                    Фильтровать по
                  </Typography>
                  <div className="flex flex-col gap-y-2">
                    {POSTS_SORT_ITEMS.map((item, i) => (
                      <DropdownMenuItem
                        key={i}
                        // onClick={(e) => handleSort(e, item.value)}
                      >
                        <Typography>
                          {item.title}
                        </Typography>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
      {posts?.map((post, i) => (
        <BlockWrapper className="flex flex-col gap-y-4" key={i}>
          <PostItemHeader
            id={post.post_id}
            name_color={name_color}
            nickname={nickname}
            created_at={post.created_at}
          />
          <PostItemBody content={post.content} />
          <PostComments post_id={post.post_id} commentsCount={post.commentsCount} />
          {currentUser && (
            <PostItemFooter post_id={post.post_id} />
          )}
        </BlockWrapper>
      ))}
    </div>
  );
};