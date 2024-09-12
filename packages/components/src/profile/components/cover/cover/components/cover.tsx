import { coverQuery } from '../queries/cover-query.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { imageCoverQuery } from '../../components/cover-image/queries/image-cover-query.ts';
import { Avatar } from '../../../../../user/components/avatar/components/avatar.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { DONATE_QUERY_KEY, DonateQuery } from '../../../../../user/components/donate/queries/donate-query.ts';
import { CoverArea } from './cover-area.tsx';
import { UserCoverMainInfo } from './cover-main-info.tsx';
import { UserCoverPanel } from './cover-panel.tsx';
import { UserCoverLayoutProps } from './cover-layout.tsx';
import { RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getPreferenceValue } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';

type UserCoverProps = {
  requestedUser: RequestedUser
} & Pick<UserCoverLayoutProps, 'isBlocked'>

export const UserCover = ({
  requestedUser, isBlocked
}: UserCoverProps) => {
  const { data: coverQueryState } = coverQuery();
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const userDonate = qc.getQueryData<DonateQuery>(
    DONATE_QUERY_KEY(requestedUser.nickname),
  );
  
  const { data: url } = imageCoverQuery({
    nickname: requestedUser.nickname,
  });
  
  if (!currentUser) return;
  
  const inView = coverQueryState.inView;
  const isOwner = currentUser?.nickname === requestedUser?.nickname;
  
  const imageHeight = inView ? 168 : 76;
  
  const nickname = requestedUser.nickname;
  const preferences = requestedUser.preferences;
  const preferOutline = getPreferenceValue(preferences, "coverOutline")
  
  return (
    <CoverArea
      variant={inView ? 'full' : 'compact'}
      backgroundColor={url ? 'transparent' : 'gray'}
      border={userDonate && preferOutline ? userDonate.donate : 'default'}
      style={{
        backgroundImage: url ? `url(${url})` : '',
      }}
    >
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div className="flex gap-x-6 z-[3] relative items-start">
        <Avatar
          variant="page"
          propHeight={imageHeight}
          propWidth={imageHeight}
          nickname={nickname}
          withBadge={{ active: false }}
        />
        <UserCoverMainInfo nickname={nickname} />
      </div>
      {(currentUser && !isBlocked) && (
        <UserCoverPanel
          reqUserNickname={nickname}
          isOwner={isOwner}
          variant={inView ? 'end' : 'default'}
        />
      )}
    </CoverArea>
  );
};