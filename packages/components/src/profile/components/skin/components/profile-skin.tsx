"use client"

import { ProfileSkinControls } from "#profile/components/skin/components/profile-skin-controls.tsx";
import { ProfileSkinRender } from "#profile/components/skin/components/profile-skin-render.tsx";
import { UserEntity } from "@repo/types/entities/entities-type";

export const UserProfileSkin = ({ 
  nickname
 }: Pick<UserEntity, "nickname">) => {
  return (
    <div className="flex h-[500px] w-[500px] gap-2">
      <ProfileSkinControls nickname={nickname} />
      <ProfileSkinRender nickname={nickname} />
    </div>
  );
};
