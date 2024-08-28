import { SkinRender } from './components/skin-render.tsx';
import { SkinControls } from './components/skin-controls.tsx';
import { Suspense } from 'react';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export interface UserSkinProps {
  reqUserNickname: string;
}

export const UserProfileSkin = async({
  reqUserNickname,
}: UserSkinProps) => {
  return (
    <div className="flex h-[500px] w-[500px]">
      <SkinControls reqUserNickname={reqUserNickname} />
      <Suspense fallback={<Skeleton className="w-24 h-64"/>}>
        <SkinRender reqUserNickname={reqUserNickname} />
      </Suspense>
    </div>
  );
};