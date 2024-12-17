"use client";

import ReactSkinview3d from "react-skinview3d";
import { useSkinViewer } from "../hooks/use-skin-viewer.ts";
import { skinStateQuery } from "../queries/skin-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";

export const ProfileSkinRender = ({ 
  nickname
 }: Pick<UserEntity, "nickname">) => {
  const { setViewerRef } = useSkinViewer();
  const { data: skinState, isLoading } = skinStateQuery(nickname);

  if (isLoading) return <Skeleton className="w-full h-[440px]" />;

  return (
    <ReactSkinview3d
      skinUrl={skinState}
      height="500"
      width="500"
      onReady={({ viewer }) => setViewerRef(viewer)}
    />
  );
};