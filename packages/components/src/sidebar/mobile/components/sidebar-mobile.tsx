"use client"

import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { ImageWrapper } from '../../../wrappers/image-wrapper.tsx';
import Logotype from '@repo/assets/images/logotype.png';
import Inspector from '@repo/assets/images/minecraft/block_inspect.webp';
import BottleEnchanting from '@repo/assets/images/minecraft/bottle_enchanting.webp';
import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

export const SidebarMobile = () => {
  const { data: currentUser, isLoading } = currentUserQuery();
  
  if (!currentUser) return;
  
  return (
    <div
      className="flex items-center justify-between gap-6 sticky bottom-0 w-full px-6 py-2 bg-shark-950 min-h-[80px] rounded-t-lg">
      <Link href="/">
        <ImageWrapper
          priority={true}
          propSrc={Logotype.src}
          width={40}
          className="relative top-1"
          height={40}
          propAlt="Go to Forum"
        />
      </Link>
      <Link href="/search?type=users">
        <ImageWrapper
          propSrc={Inspector.src}
          propAlt="Search peoples"
          className="w-[42px] h-[42px] relative top-1"
          width={42}
          height={42}
          loading="lazy"
        />
      </Link>
      <Link href="/search?type=threads">
        <ImageWrapper
          propSrc={BottleEnchanting.src}
          propAlt="Search threads"
          className="w-[38px] h-[38px]"
          width={38}
          height={38}
          loading="lazy"
        />
      </Link>
      <Link href={USER_URL + currentUser.nickname}>
        <Avatar
          variant="default"
          border="withBorder"
          className="overflow-hidden min-w-[38px] min-h-[38px]"
          propWidth={38}
          propHeight={38}
          nickname={currentUser.nickname}
        />
      </Link>
    </div>
  );
};
