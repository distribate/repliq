import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { coverAtom } from "#components/profile/header/models/cover.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserCoverDetailsAtom } from "#components/profile/requested-user.model.ts";
import { UserCoverAvatar } from "./cover-avatar.tsx";
import { UserCoverLocation } from "./cover-location.tsx";
import { CoverArea } from "./cover-area.tsx";
import { lazy, Suspense } from "react";

const UserCoverWatermark = lazy(() => import("./cover-watermark.tsx").then(m => ({ default: m.UserCoverWatermark })))

export const UserCover = reatomComponent(({ ctx }) => {
  const coverDetails = ctx.spy(requestedUserCoverDetailsAtom)
  if (!coverDetails) return;

  const { backgroundColor, backgroundImage, outline, coverImage } = coverDetails;
  const variant = ctx.spy(coverAtom).inView ? "full" : "compact"

  return (
    <CoverArea variant={variant} backgroundColor={backgroundColor} outline={outline} style={{ backgroundImage }}>
      {!coverImage && (
        <Suspense>
          <UserCoverWatermark />
        </Suspense>
      )}
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div className="flex flex-col gap-y-2 lg:flex-row gap-x-6 z-[4] relative items-center lg:items-start">
        <UserCoverAvatar />
        <UserCoverMainInfo />
      </div>
      <UserCoverLocation />
      <UserCoverPanel />
    </CoverArea>
  );
}, "UserCover")