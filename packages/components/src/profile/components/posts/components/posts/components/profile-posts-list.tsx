"use client";

import { postsQuery } from "../queries/posts-query.ts";
import dynamic from "next/dynamic";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { ProfilePostsFiltering } from "#profile/components/posts/components/posts/components/profile-posts-filtering.tsx";
import { ProfilePostsListCard } from "#profile/components/posts/components/posts/components/profile-posts-list-card.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Separator } from "@repo/ui/src/components/separator.tsx";

const SomethingError = dynamic(() =>
  import("#templates/something-error.tsx").then((m) => m.SomethingError),
);

export const ProfilePosts = ({
  nickname
}: Pick<UserEntity, "nickname">) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfilePostsFiltering nickname={nickname} />
      <ProfilePostsList nickname={nickname}/>
    </div>
  )
}

export const ProfilePostsList = ({
  nickname
}: Pick<UserEntity, "nickname">) => {
  const { data, isError, isLoading } = postsQuery({
    requestedUserNickname: nickname
  });
  
  if (!data) return null;

  const postsData = data.data;
  const posts = postsData?.filter((post) => !post.isPinned) || [];
  const pinnedPost = postsData?.find((post) => post.isPinned);
  
  if (isLoading) return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
  
  if (isError) return <SomethingError />;
  
  if (!postsData) return <ContentNotFound title="Постов не найдено." />
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {!isLoading && postsData && (
        <>
          {pinnedPost && (
            <>
              <ProfilePostsListCard {...pinnedPost} />
              <Separator />
            </>
          )}
          {posts.map((post) => (
            <ProfilePostsListCard {...post} />
          ))}
          {/*{hasMore && <div ref={ref} className="h-[1px] w-full relative" />}*/}
        </>
      )}
    </div>
  );
}