import { useCallback, useEffect, useRef } from "react";
import {
  IdleAnimation,
  RunningAnimation,
  FlyingAnimation,
  SkinViewer,
} from "skinview3d";
import { skinAnimationQuery } from "../queries/skin-query.ts";

const animationClasses = {
  idle: IdleAnimation,
  run: RunningAnimation,
  flying: FlyingAnimation,
};

export const useSkinViewer = () => {
  const { data: skinState } = skinAnimationQuery();
  const viewerRef = useRef<SkinViewer | null>(null);

  let animation:
    | typeof IdleAnimation
    | typeof RunningAnimation
    | typeof FlyingAnimation = IdleAnimation;

  const updateViewer = (viewer: SkinViewer) => {
    if (skinState.animation) {
      animation = animationClasses[skinState.animation];
    }

    viewer.animation = new animation();
    viewer.autoRotate = !!skinState.rotate;
  };

  useEffect(() => {
    if (viewerRef.current) updateViewer(viewerRef.current);
  }, [skinState.animation, skinState.rotate]);

  const setViewerRef = useCallback(
    (viewer: SkinViewer) => {
      viewerRef.current = viewer;
      updateViewer(viewer);
    },
    [skinState.animation, skinState.rotate],
  );

  return { setViewerRef };
};
