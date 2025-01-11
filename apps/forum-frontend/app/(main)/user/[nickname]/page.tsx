import { Metadata } from 'next';
import { Suspense } from 'react';
import { MetadataType, PageConventionProps } from '@repo/types/global';
import { UserCoverSkeleton } from '@repo/components/src/skeletons/user-cover-skeleton.tsx';
import { UserCoverLayout } from '@repo/components/src/profile/components/cover/components/cover-layout.tsx';
import { Selectable } from 'kysely';
import type { Users } from '@repo/types/db/forum-database-types.ts';
import { ProfileContent } from "@repo/components/src/profile/components/profile-content/components/profile-content.tsx";

export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { nickname } = params;
  return {
    title: nickname ?? "Загрузка...",
    description: `Профиль игрока ${nickname}`,
    keywords: [nickname ?? "player", `fasberry profile player`, `${nickname} profile`,],
  };
}

export default async function ProfilePage({
  params
}: PageConventionProps) {
  const { nickname } = params;

  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <Suspense fallback={<UserCoverSkeleton />}>
        <UserCoverLayout requestedUserNickname={nickname}>
        <ProfileContent requestedUserNickname={nickname} />
        </UserCoverLayout>
      </Suspense>
    </div>
  );
}