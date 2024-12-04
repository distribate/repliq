"use client";

import DefaultSkin from "@repo/assets/images/default.png";
import ReactSkinview3d from "react-skinview3d";
import { useSkinViewer } from "../hooks/use-skin-viewer.ts";
import { useSkinStateQuery } from "../queries/skin-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserSkinProps } from "#profile/components/skin/components/profile-skin.tsx";

export const ProfileSkinRender = ({ reqUserNickname }: UserSkinProps) => {
  const { setViewerRef } = useSkinViewer();
  const { data: skinState, isLoading } = useSkinStateQuery(reqUserNickname);

  if (isLoading) return <Skeleton className="w-full h-[500px]" />;

  return (
    <ReactSkinview3d
      skinUrl={skinState || DefaultSkin.src}
      height="500"
      width="500"
      onReady={({ viewer }) => setViewerRef(viewer)}
    />
  );
};
