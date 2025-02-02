import { useSkinViewer } from "../hooks/use-skin-viewer.ts";
import { skinStateQuery } from "../queries/skin-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import Cape from "@repo/assets/images/minecraft/cape_default.png";
import ReactSkinview3d from "react-skinview3d";

function isHardwareAccelerationEnabled(): boolean {
  const canvas = document.createElement('canvas');
  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

  if (!gl) {
    return false;
  }

  return true;
}

export const ProfileSkinRender = ({
  nickname
}: Pick<UserEntity, "nickname">) => {
  const { setViewerRef } = useSkinViewer();
  const { data: skinUrl, isLoading } = skinStateQuery(nickname);

  if (isLoading) return <Skeleton className="w-full h-full" />;

  const isHardwareAccEnabled = isHardwareAccelerationEnabled();

  return (
    <div className="flex items-center justify-center py-2 overflow-hidden border-4 border-shark-800 rounded-lg w-full">
      {isHardwareAccEnabled ? (
        <ReactSkinview3d
          skinUrl={skinUrl}
          height="450"
          width="350"
          options={{
            zoom: 0.8
          }}
          capeUrl={Cape}
          onReady={({ viewer }) => setViewerRef(viewer)}
        />
      ) : (
        <div className="flex w-full items-center justify-center h-full">
          <Typography textSize="large" className="truncate whitespace-pre-wrap">
            Графическое аппаратное ускорение не включено.
          </Typography>
        </div>
      )}
    </div>
  );
};