import { InView } from "react-intersection-observer";
import { coverAtom } from "#components/profile/header/models/cover.model";
import { UserCover } from "./cover";
import { lazy, PropsWithChildren, Suspense } from "react";
import { UserCoverSkeleton } from "#components/skeletons/components/user-cover-skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserAction, requestedUserAtom, requestedUserProfileStatusAtom } from "#components/profile/requested-user.model";

const Privated = lazy(() => import("#components/templates/components/profile-privated").then(m => ({ default: m.ProfilePrivated })));

const UserDescription = reatomComponent(({ ctx }) => {
  const description = ctx.spy(requestedUserAtom)?.description

  if (!description) return null;

  return (
    <div className="flex lg:hidden bg-shark-950 p-2 rounded-md mt-4">
      <Typography textColor="shark_white" className="font-[Minecraft]" textSize="medium">
        О себе: {description}
      </Typography>
    </div>
  )
}, "UserDescription")

export const UserCoverLayout = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  const inView = ctx.spy(coverAtom).inView
  const isLoading = ctx.spy(requestedUserAction.statusesAtom).isPending
  const status = ctx.spy(requestedUserProfileStatusAtom)

  return (
    <>
      {isLoading ? <UserCoverSkeleton /> : (
        <>
          <InView
            as="div"
            className={inView ? `h-svh absolute left-0 top-0 right-0` : "h-[20px] absolute left-0 top-0 right-0"}
            onChange={(inView, _) => coverAtom(ctx, (state) => ({ ...state, inView }))}
          />
          <div className="w-full h-full relative">
            <UserCover />
            <UserDescription />
          </div>
        </>
      )}
      {status === 'privated' ? (
        <Suspense>
          <Privated />
        </Suspense>
      ) : (
        <div className="w-full h-full relative">
          {children}
        </div>
      )}
    </>
  );
}, "UserCoverLayout")