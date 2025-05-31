import { skinAtom, skinStateAction } from "../models/skin.model.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";
import { skinViewerAtom } from "../models/skin-animation.model.ts";
import { lazy, Suspense } from "react";
import { hardwareAccelerationIsActive } from "@repo/lib/helpers/hardware-acceleration-check.ts"

const ReactSkinview3d = lazy(() => import("react-skinview3d").then(m => ({ default: m.default })))

onConnect(skinStateAction, (ctx) => {
  const isHardwareAccEnabled = hardwareAccelerationIsActive();
  if (!isHardwareAccEnabled) return;

  skinStateAction(ctx)
})

export const ProfileSkinRender = reatomComponent(({ ctx }) => {
  const skinUrl = ctx.spy(skinAtom)!

  if (ctx.spy(skinStateAction.statusesAtom).isPending) {
    return <Skeleton className="w-full h-full" />;
  }

  const isHardwareAccEnabled = hardwareAccelerationIsActive();

  return (
    <div className="flex items-center min-h-[450px] justify-center py-2 overflow-hidden border-4 border-shark-800 rounded-lg w-full">
      {isHardwareAccEnabled ? (
        <Suspense>
          <ReactSkinview3d
            skinUrl={skinUrl}
            height="450"
            width="350"
            options={{ zoom: 0.8 }}
            className="cursor-move"
            // @ts-expect-error
            onReady={({ viewer }) => skinViewerAtom(ctx, viewer)}
          />
        </Suspense>
      ) : (
        <div className="flex w-full px-2 py-6 items-center justify-center h-full">
          <Typography textSize="large" textColor="gray" className="truncate text-center whitespace-pre-wrap">
            Графическое аппаратное ускорение не включено.
          </Typography>
        </div>
      )}
    </div>
  );
}, "ProfileSkinRender")