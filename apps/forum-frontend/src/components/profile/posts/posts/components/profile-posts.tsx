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

onConnect(postsAction, postsAction)

export const UserProfilePosts = reatomComponent(({ ctx }) => {
  if (ctx.spy(postsAction.statusesAtom).isPending) return <UserPostsSkeleton />

  return (
    <ProfileWrapper header={ctx.spy(requestedUserIsSameAtom) && <CreatePostSection />}>
      <ProfilePosts />
    </ProfileWrapper>
  );
}, "UserProfilePosts")