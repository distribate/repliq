import { HoverCardWrapper } from '../../../wrappers/hover-card-wrapper.tsx';
import Link from 'next/link';
import { USER } from '@repo/types/entities/entities-type.ts';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../../../user/components/name/components/nickname.tsx';
import { UserDonate } from '../../../user/components/donate/components/donate.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import dynamic from 'next/dynamic';

export type UserCardProps = Pick<USER, 'nickname'
  | 'description'
  | 'created_at'
  | 'name_color'
>;

const UserPreviewCardProperties = dynamic(() =>
  import('./components/preview-properties.tsx')
  .then(m => m.UserPreviewCardProperties),
);

export const UserPreviewCard = ({
  nickname, name_color, created_at, description
}: UserCardProps) => {
  
  if (!nickname) return;
  
  return (
    <HoverCardWrapper
      properties={{ sideAlign: 'left', contentAlign: 'start', contentClassname: 'min-w-[300px]' }}
      trigger={
        <div className="flex gap-2 items-center px-2 py-1 cursor-pointer">
          <Avatar propHeight={18} propWidth={18} nickname={nickname} />
          <UserNickname nickname={nickname} nicknameColor={name_color} className="text-sm font-normal" />
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
                  <Link href={`/user/${nickname}`} className="max-w-[140px]">
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