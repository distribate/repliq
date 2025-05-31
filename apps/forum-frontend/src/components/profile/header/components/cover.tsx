import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { coverAtom } from "#components/profile/header/models/cover.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserCoverDetailsAtom } from "#components/profile/main/models/requested-user.model.ts";
import { UserCoverAvatar } from "./cover-avatar.tsx";
import { UserCoverLocation } from "./cover-location.tsx";
import { CoverArea } from "./cover-area.tsx";
import { lazy, Suspense } from "react";
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query.ts";

const UserCoverWatermark = lazy(() => import("./cover-watermark.tsx").then(m => ({ default: m.UserCoverWatermark })))

export const UserCover = reatomComponent(({ ctx }) => {
  const coverDetails = ctx.spy(requestedUserCoverDetailsAtom)
  if (!coverDetails) return;

  const inView = ctx.spy(coverAtom).inView
  const { backgroundColor, backgroundImage, outline, coverImage } = coverDetails;
  const variant = inView ? "full" : "compact"

  return (
    <CoverArea data-variant={variant} variant={variant} backgroundColor={backgroundColor} outline={outline} style={{ backgroundImage }}>
      {!coverImage && (
        <Suspense>
          <UserCoverWatermark />
        </Suspense>
      )}
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div
        className="flex gap-x-6 gap-y-2 relative items-center z-[4]
          group-data-[variant=compact]:flex-row flex-col group-data-[variant=compact]:justify-between
          group-data-[variant=full]:lg:flex-row group-data-[variant=full]:lg:items-start"
      >
        <UserCoverAvatar variant={variant} />
        <UserCoverMainInfo />
        <div className="group-data-[variant=compact]:hidden block lg:hidden">
          <UserCoverLocation />
        </div>
      </div>
      <div className="group-data-[variant=compact]:hidden hidden lg:block absolute top-4 right-4 z-[5]">
        <UserCoverLocation />
      </div>
      {ctx.spy(isAuthenticatedAtom) && (
        <div
          className="flex w-1/2 lg:w-fit items-center bg-transparent gap-4 relative z-[3]
          group-data-[variant=compact]:hidden
          group-data-[variant=full]:lg:self-end group-data-[variant=full]:justify-center group-data-[variant=full]:lg:justify-end 
      "
        >
          <UserCoverPanel />
        </div>
      )}
    </CoverArea>
  );
}, "UserCover")