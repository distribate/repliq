import { ProfileSkinControls } from '#profile/components/skin/components/profile-skin-controls.tsx';
import { ProfileSkinRender } from '#profile/components/skin/components/profile-skin-render.tsx';

export interface UserSkinProps {
  reqUserNickname: string;
}

export const UserProfileSkin = async({
  reqUserNickname,
}: UserSkinProps) => {
  return (
    <div className="flex h-[500px] w-[500px] gap-2">
      <ProfileSkinControls reqUserNickname={reqUserNickname} />
      <ProfileSkinRender reqUserNickname={reqUserNickname} />
    </div>
  );
};