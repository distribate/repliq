import { CreatePostSection } from '#components/profile/posts/create-post/create-post-section.tsx';
import {
  ProfilePosts,
} from '#components/profile/posts/posts/components/profile-posts-list.tsx';
import { ProfileWrapper } from '#components/wrappers/components/profile-wrapper';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserIsSameAtom } from '#components/profile/requested-user.model';
import { postsAction } from '../models/posts.model';
import { UserPostsSkeleton } from '#components/skeletons/components/user-posts-skeleton';
import { onConnect } from '@reatom/framework';
import { userGlobalOptionsAtom } from '@repo/lib/helpers/get-user';

onConnect(postsAction, postsAction)

export const UserProfilePosts = reatomComponent(({ ctx }) => {
  if (ctx.spy(postsAction.statusesAtom).isPending) return <UserPostsSkeleton />

  const can_create_posts = ctx.spy(userGlobalOptionsAtom).can_create_posts

  const isVisible = can_create_posts && ctx.spy(requestedUserIsSameAtom)

  return (
    <ProfileWrapper header={isVisible && <CreatePostSection />}>
      <ProfilePosts />
    </ProfileWrapper>
  );
}, "UserProfilePosts")