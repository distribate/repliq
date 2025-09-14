import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { SomethingError } from '#components/templates/components/something-error.tsx';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { postsAction, postsDataAtom, postsNotPinnedDataAtom, postsPinnedDataAtom, ProfilePostsViewer, updatePostsAction } from '../models/posts.model';
import { PostItemHeader } from "#components/post/components/post-head/post-head";
import { PostItemBody } from "#components/post/components/post-body/post-body";
import { PostFooter } from "#components/post/components/post-footer/post-footer";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { lazy, Suspense } from "react";

const PostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

const PostControl = lazy(() =>
  import("#components/post/components/post-control/post-control").then((m) => ({ default: m.PostControl }))
);

type ProfilePostsListCardProps = Pick<UserPostItem,
  | "id"
  | "content"
  | "isPinned"
  | "created_at"
  | "nickname"
  | "isUpdated"
  | "views_count"
  | "visibility"
  | "isViewed"
  | "isComments"
> & {
  avatar: string | null
}

const ProfilePostsListCard = ({
  nickname, created_at, isPinned, id, content, visibility, views_count, isUpdated, isViewed, isComments, avatar
}: ProfilePostsListCardProps) => {
  return (
    <div className="flex bg-shark-950 group rounded-lg w-full p-2 sm:p-4 flex-col gap-y-2">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full items-center">
          <PostItemHeader
            nickname={nickname}
            created_at={created_at}
            avatar={avatar}
            visibility={visibility}
            isPinned={isPinned}
          />
          <Suspense>
            <PostControl id={id} nickname={nickname} />
          </Suspense>
        </div>
        <PostItemBody id={id} nickname={nickname} content={content} />
      </div>
      <PostFooter
        id={id}
        nickname={nickname}
        views_count={views_count}
        isViewed={isViewed}
        isUpdated={isUpdated}
      />
    </div>
  );
};

const ProfilePinnedPosts = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postsPinnedDataAtom)[0] // only 1 post

  if (!data) return null;

  return (
    <>
      <ProfilePostsListCard {...data} />
      <Separator />
    </>
  )
}, "ProfilePinnedPosts")

const ProfileNotPinnedPosts = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postsNotPinnedDataAtom)

  return data.map(post => <ProfilePostsListCard key={post.id} {...post} />)
}, "ProfileNotPinnedPosts")

export const ProfilePostsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postsDataAtom);

  if (ctx.spy(postsAction.statusesAtom).isPending) {
    return <SectionSkeleton />;
  }

  if (ctx.spy(postsAction.statusesAtom).isRejected) {
    return <SomethingError />;
  }

  if (!data || !data.length) {
    return <ContentNotFound title="Посты не найдены" />;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <ProfilePinnedPosts />
      <ProfileNotPinnedPosts />
      {ctx.spy(updatePostsAction.statusesAtom).isPending && <PostsSkeleton />}
    </div>
  );
}, "ProfilePostsList")