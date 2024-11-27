import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { PostEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import Link from 'next/link';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { Pin } from 'lucide-react';

type PostItemHeaderProps = Pick<UserEntity, 'nickname' | 'created_at'>
  & Pick<PostEntity, 'visibility' | 'isPinned'>

export const PostItemHeader = ({
  nickname, created_at, visibility, isPinned,
}: PostItemHeaderProps) => {
  const dateCreated = dayjs(created_at).fromNow();
  
  const visibilityStatus = visibility === 'only' ? 'видно только вам' : 'видно только друзьям'
  
  return (
    <div className="flex gap-2 items-center">
      <Link href={USER_URL + nickname}>
        <Avatar variant="page" propHeight={48} propWidth={48} nickname={nickname} />
      </Link>
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-2">
          <Link href={USER_URL + nickname}>
            <UserNickname nickname={nickname} className="text-base font-medium" />
          </Link>
          {visibility !== 'all' && (
            <Typography textSize="small" textColor="gray" className="self-end">
              {visibilityStatus}
            </Typography>
          )}
          {isPinned && <Pin size={18} className="text-gold-500" />}
        </div>
        <Typography className="text-shark-200 text-sm">
          {dateCreated}
        </Typography>
      </div>
    </div>
  );
};