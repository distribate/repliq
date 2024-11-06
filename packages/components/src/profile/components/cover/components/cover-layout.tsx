'use client';

import { InView } from 'react-intersection-observer';
import { UserCover } from './cover.tsx';
import { UserCoverSkeleton } from '#skeletons/user-cover-skeleton.tsx';
import { useCover } from '#profile/components/cover/hooks/use-cover.ts';
import { coverQuery } from '#profile/components/cover/queries/cover-query.ts';
import { requestedUserQuery } from '#profile/components/cover/queries/requested-user-query.ts';

export type UserCoverLayoutProps = {
  requestedUserNickname: string
}

export const UserCoverLayout = ({
  requestedUserNickname
}: UserCoverLayoutProps) => {
  const { data: coverQueryState } = coverQuery();
  const { setCoverStateMutation } = useCover();
  const { data: requestedUser, isLoading } = requestedUserQuery(requestedUserNickname);
  
  if (typeof requestedUser === 'string') return null;
  
  const inView = coverQueryState.inView;
  
  if (isLoading) return <UserCoverSkeleton />;
  
  return (
    <>
      <InView
        as="div"
        className={`${inView ? 'h-[612px] absolute left-0 top-0 right-0' : 'h-[200px] absolute top-0'}`}
        onChange={(inView, entry) => {
          setCoverStateMutation.mutate({
            inView: inView, entry: entry,
          });
        }}
      />
      {requestedUser && (
        <UserCover requestedUser={requestedUser}  />
      )}
    </>
  );
};