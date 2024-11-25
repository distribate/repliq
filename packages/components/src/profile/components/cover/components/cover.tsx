import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { CoverArea } from './cover-area.tsx';
import { UserCoverMainInfo } from './cover-main-info.tsx';
import { UserCoverPanel } from './cover-panel.tsx';
import { RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getPreferenceValue } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';
import { coverQuery } from '#profile/components/cover/queries/cover-query.ts';
import { imageCoverQuery } from '#profile/components/cover/queries/image-cover-query.ts';
import { CurrentUser } from '@repo/lib/queries/current-user-query.ts';

type UserCoverProps = {
  requestedUser: RequestedUser | CurrentUser
}

export const UserCover = ({
  requestedUser
}: UserCoverProps) => {
  const { data: coverQueryState } = coverQuery();
  const { data: url } = imageCoverQuery(requestedUser.nickname);
  
  const userDonate = requestedUser.donate;
  const imageHeight = coverQueryState.inView ? 168 : 76;
  const nickname = requestedUser.nickname;
  const preferences = requestedUser.preferences;
  const preferOutline = getPreferenceValue(preferences, 'coverOutline');
  const backgroundImage = url ? `url(${url})` : '';
  const backgroundColor = url ? 'transparent' : 'gray';
  const coverOutline = (userDonate && preferOutline) ? userDonate : 'default';
  
  return (
    <CoverArea
      variant={coverQueryState.inView ? 'full' : 'compact'}
      backgroundColor={backgroundColor}
      outline={coverOutline}
      style={{ backgroundImage }}
    >
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div className="flex gap-x-6 z-[3] relative items-start">
        <Avatar
          variant="page"
          propHeight={imageHeight}
          propWidth={imageHeight}
          nickname={nickname}
        />
        <UserCoverMainInfo nickname={nickname} />
      </div>
      <UserCoverPanel
        requestedNickname={nickname}
        variant={coverQueryState.inView ? 'end' : 'default'}
      />
    </CoverArea>
  );
};