"use client";

import ReactSkinview3d from "react-skinview3d";
import { useSkinViewer } from "../hooks/use-skin-viewer.ts";
import { skinStateQuery } from "../queries/skin-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";

function isHardwareAccelerationEnabled(): boolean {
  const canvas = document.createElement('canvas');
  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

  if (!gl) {
    return false;
  }

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

  return true;
}

export const ProfileSkinRender = ({ 
  uuid
 }: Pick<UserEntity, "uuid">) => {
  const { setViewerRef } = useSkinViewer();
  const { data: skinState, isLoading } = skinStateQuery(uuid);

  if (isLoading) return <Skeleton className="w-full h-[440px]" />;

  const isHardwareAccEnabled = isHardwareAccelerationEnabled();
  console.log(isHardwareAccEnabled, skinState)

  return (
    <>
    {isHardwareAccEnabled ? (
      <ReactSkinview3d
        skinUrl={skinState}
        height="500"
        width="500"
        onReady={({ viewer }) => setViewerRef(viewer)}
      />
    ) : (
      <div className="flex w-full items-center justify-center h-full">
        <Typography textSize="large" className="truncate whitespace-pre-wrap">
          Графическое аппаратное ускорение не включено.
        </Typography>
      </div>
    )}
    </>
  );
};