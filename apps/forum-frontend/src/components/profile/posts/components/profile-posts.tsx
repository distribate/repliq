import { CreatePostSection } from '#components/profile/posts/components/create-post-section';
import { ProfileWrapper } from '#components/wrappers/components/profile-wrapper';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserIsSameAtom } from '#components/profile/main/models/requested-user.model';
import { UserPostsSkeleton } from '#components/skeletons/components/user-posts-skeleton';
import { onConnect } from '@reatom/framework';
import { postsAction } from '../models/posts.model';
import { ProfilePosts } from './profile-posts-list';
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model';

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