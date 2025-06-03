import { InView } from "react-intersection-observer";
import { coverAtom } from "#components/profile/header/models/cover.model";
import { UserCover, UserCoverWrapper } from "./cover";
import { lazy, PropsWithChildren, Suspense } from "react";
import { UserCoverSkeleton } from "#components/skeletons/components/user-cover-skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserAccountTypeAtom, requestedUserAction, requestedUserAtom, requestedUserProfileStatusAtom } from "#components/profile/main/models/requested-user.model";
import { UserCoverAvatarWrapper } from "./cover-avatar";
import { UserNickname } from "#components/user/name/nickname";

const Privated = lazy(() => import("#components/templates/components/profile-privated").then(m => ({ default: m.ProfilePrivated })));

const UserDescription = reatomComponent(({ ctx }) => {
  const description = ctx.spy(requestedUserAtom)?.description

  if (!description) return null;

  return (
    <div className="flex lg:hidden bg-shark-950 p-2 rounded-md mt-4">
      <Typography textColor="shark_white" textSize="medium">
        О себе: {description}
      </Typography>
    </div>
  )
}, "UserDescription")

const DeletedAccountCover = reatomComponent(({ ctx }) => {
  const inView = ctx.spy(coverAtom).inView
  const variant = inView ? "full" : "compact"

  const requestedUser = ctx.spy(requestedUserAtom)
  if (!requestedUser) return;

  return (
    <div className="w-full h-full relative">
      <UserCoverWrapper>
        <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
        <div
          className="flex gap-x-6 gap-y-2 relative items-center z-[4]
          group-data-[variant=compact]:flex-row flex-col group-data-[variant=compact]:justify-between
          group-data-[variant=full]:lg:flex-row group-data-[variant=full]:lg:items-start"
        >
          <UserCoverAvatarWrapper variant={variant}>
            <div className="flex items-center bg-shark-800 justify-center w-full h-full rounded-md">
              <span>DELETED</span>
            </div>
          </UserCoverAvatarWrapper>
          <div className="flex flex-col lg:items-start items-center self-end justify-between h-1/2 gap-y-1">
            <div className="flex flex-col lg:items-start items-center truncate">
              <div className="flex items-center gap-1">
                <UserNickname
                  nickname={requestedUser.nickname}
                  nicknameColor={requestedUser.name_color}
                  className={inView ? "text-xl lg:text-3xl" : "text-xl"}
                />
              </div>
            </div>
          </div>
        </div>
      </UserCoverWrapper>
      <UserDescription />
    </div>
  )
}, "DeletedAccountCover")

export const UserCoverLayout = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  if (ctx.spy(requestedUserAccountTypeAtom) === 'deleted' || ctx.spy(requestedUserAccountTypeAtom) === 'archived') {
    return (
      <>
        <DeletedAccountCover />
        {children}
      </>
    )
  }

  const inView = ctx.spy(coverAtom).inView
  const status = ctx.spy(requestedUserProfileStatusAtom)

  return (
    <>
      {ctx.spy(requestedUserAction.statusesAtom).isPending ? <UserCoverSkeleton /> : (
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