import { CreatePostSection } from '#components/profile/posts/components/create-post-section';
import { ProfileWrapper } from '#ui/profile-wrapper';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserIsSameAtom } from '#components/profile/main/models/requested-user.model';
import { onConnect } from '@reatom/framework';
import { postsAction } from '../models/posts.model';
import { ProfilePosts } from './profile-posts-list';
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model';
import { SectionSkeleton } from '#components/templates/components/section-skeleton';

onConnect(postsAction, postsAction)

export const UserProfilePosts = reatomComponent(({ ctx }) => {
  if (ctx.spy(postsAction.statusesAtom).isPending) return <SectionSkeleton />

  const can_create_posts = ctx.spy(userGlobalOptionsAtom).can_create_posts

  const isVisible = can_create_posts && ctx.spy(requestedUserIsSameAtom)

  return (
    <ProfileWrapper header={isVisible && <CreatePostSection />}>
      <ProfilePosts />
    </ProfileWrapper>
  );
}, "UserProfilePosts")