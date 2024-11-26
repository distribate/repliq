'use client';

import Link from 'next/link';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import dynamic from 'next/dynamic';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import Spyglass from '@repo/assets/images/minecraft/spyglass.webp';

export type UserCardProps = Pick<UserEntity,
  | 'nickname' | 'description' | 'created_at' | 'name_color'
>;

const UserPreviewCardProperties = dynamic(() =>
  import('./components/preview-properties.tsx')
  .then(m => m.UserPreviewCardProperties),
);

export const UserPreviewCard = ({
  nickname, name_color, created_at, description,
}: UserCardProps) => {
  return (
    <DropdownWrapper
      properties={{
        sideAlign: 'left',
        contentAlign: 'start',
        contentClassname: "w-[320px]",
      }}
      trigger={
        <div className="flex cursor-pointer rounded-sm h-[50px] relative group w-[50px] hover:bg-shark-900 overflow-hidden">
          <div className="group-hover:flex z-[2] hidden items-center justify-center absolute h-full w-full bg-black/60">
            <img src={Spyglass.src} width={26} height={26} alt="" />
          </div>
          <Avatar nickname={nickname} propHeight={50} propWidth={50} />
        </div>
      }
      content={
        <div className="flex flex-col w-full">
          <div className="flex flex-col p-2 w-full">
            <div className="flex justify-between w-full">
              <div className="flex gap-2 items-center">
                <div className="min-h-[48px] max-w-[48px] max-h-[48px] min-w-[48px]">
                  <Avatar propHeight={48} propWidth={48} nickname={nickname} />
                </div>
                <div className="flex flex-col w-full justify-between h-[48px]">
                  <Link href={USER_URL + nickname} className="max-w-[140px]">
                    <UserNickname
                      nickname={nickname}
                      nicknameColor={name_color}
                      className="text-sm font-normal truncate"
                    />
                  </Link>
                  <div className="w-fit">
                    <UserDonate nickname={nickname} />
                  </div>
                </div>
              </div>
              <div className="w-fit">
                <UserPreviewCardProperties nickname={nickname} />
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-row bg-shark-900 px-2 py-1">
            asdasd
          </div>
        </div>
      }
    />
  );
};