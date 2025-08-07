import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { coverAtom } from "#components/profile/header/models/cover.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserCoverDetailsAtom, requestedUserCoverImageAtom } from "#components/profile/main/models/requested-user.model.ts";
import { UserCoverAvatar } from "./cover-avatar.tsx";
import { CoverArea } from "./cover-area.tsx";
import { lazy, PropsWithChildren, Suspense } from "react";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model.ts";

const UserCoverWatermark = lazy(() => import("./cover-watermark.tsx").then(m => ({ default: m.UserCoverWatermark })))

export const UserCover = reatomComponent(({ ctx }) => {
  const inView = ctx.spy(coverAtom).inView
  const variant = inView ? "full" : "compact"

  return (
    <UserCoverWrapper>
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div
        className="flex gap-x-6 gap-y-2 relative items-center z-[4]
          flex-col lg:flex-row lg:items-start"
      >
        <UserCoverAvatar variant={variant} />
        <UserCoverMainInfo />
      </div>
      {ctx.spy(isAuthenticatedAtom) && (
        <div
          className="flex w-1/2 lg:w-fit items-center bg-transparent gap-4 relative z-[3] lg:self-end justify-center lg:justify-end"
        >
          <UserCoverPanel />
        </div>
      )}
    </UserCoverWrapper>
  )
}, "UserCover")

export const UserCoverWrapper = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  const coverDetails = ctx.spy(requestedUserCoverDetailsAtom)
  const coverImage = ctx.spy(requestedUserCoverImageAtom)
  if (!coverDetails) return;

  const { backgroundColor, outline } = coverDetails;

  return (
    <CoverArea variant={"full"} backgroundColor={backgroundColor} outline={outline}>
      {coverImage ? (
        <div className="flex justify-center items-center h-full absolute inset-0 z-[1]">
          <img src={coverImage} className="object-cover object-center w-full  h-[414px]" alt="" />
        </div>
      ) : (
        <Suspense>
          <UserCoverWatermark />
        </Suspense>
      )}
      {children}
    </CoverArea>
  );
}, "UserCoverWrapper")