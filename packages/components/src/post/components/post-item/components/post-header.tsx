import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { PostEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import Link from 'next/link';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import dynamic from 'next/dynamic';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

const PostControl = dynamic(() =>
  import('./post-control.tsx')
  .then(m => m.PostControl),
);

type PostItemHeaderProps = Pick<UserEntity, 'nickname' | 'created_at' | 'id'>
  & Pick<PostEntity, 'visibility'>

export const PostItemHeader = ({
  nickname, created_at, id, visibility,
}: PostItemHeaderProps) => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const isOwner = currentUser.nickname === nickname;
  
  return (
    <div className="flex justify-between w-full items-center">
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
                {visibility === 'only' ? 'видно только вам' : 'видно только друзьям'}
              </Typography>
            )}
          </div>
          <Typography className="text-shark-200 text-sm">
            {dayjs(created_at).fromNow()}
          </Typography>
        </div>
      </div>
      {isOwner && <PostControl id={id} nickname={nickname} />}
    </div>
  );
};