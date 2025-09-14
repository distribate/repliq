import { HeadAreaWrapper } from "./head-area-wrapper";
import { PropsWithChildren } from "react";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserAccountTypeAtom, requestedUserAtom } from "#components/profile/models/requested-user.model";
import { HeadAvatar, headAvatarVariants } from "./head-avatar";
import { UserNickname } from "#components/user/components/name/nickname";
import { HeadMainInfo } from "./head-main-info";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { HeadPanel } from "./head-panel";

const HeadDeletedVariant = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom)
  if (!requestedUser) return null;

  const { description, name_color, nickname } = requestedUser

  return (
    <div className="w-full h-full relative">
      <HeadAreaWrapper>
        <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
        <div
          className="flex gap-x-6 gap-y-2 relative items-center z-[4]
            group-data-[variant=compact]:flex-row flex-col group-data-[variant=compact]:justify-between
            group-data-[variant=full]:lg:flex-row group-data-[variant=full]:lg:items-start"
        >
          <div className={headAvatarVariants()}>
            <div className="flex items-center bg-shark-800 justify-center w-full h-full rounded-md">
              <span>DELETED</span>
            </div>
          </div>
          <div className="flex flex-col lg:items-start items-center self-end justify-between h-1/2 gap-y-1">
            <div className="flex flex-col lg:items-start items-center truncate">
              <div className="flex items-center gap-1">
                <UserNickname
                  nickname={nickname}
                  nicknameColor={name_color}
                  className="text-xl lg:text-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </HeadAreaWrapper>
      {description && (
        <div className="lg:hidden flex mt-4">
          <UserDescription description={description} />
        </div>
      )}
    </div>
  )
}, "HeadDeletedVariant")

const DeletedLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <HeadDeletedVariant />
      {children}
    </>
  )
}

const UserDescription = reatomComponent<{ description: string }>(({ ctx, description }) => {
  return (
    <div className="flex bg-shark-950 w-full p-2 rounded-md">
      <Typography textColor="shark_white" textSize="medium">
        О себе: {description}
      </Typography>
    </div>
  )
}, "UserDescription")

export const HeadLayout = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  const requestedUser = ctx.spy(requestedUserAtom);
  if (!requestedUser) return null;

  const isDeleted = ctx.spy(requestedUserAccountTypeAtom) === 'deleted'
    || ctx.spy(requestedUserAccountTypeAtom) === 'archived'

  if (isDeleted) {
    return <DeletedLayout>{children}</DeletedLayout>
  }

  return (
    <>
      <div className="w-full h-full relative">
        <HeadAreaWrapper>
          <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
          <div
            className="flex gap-x-6 gap-y-2 relative items-center z-[4]
                  flex-col lg:flex-row lg:items-start"
          >
            <HeadAvatar />
            <HeadMainInfo />
          </div>
          {ctx.spy(isAuthenticatedAtom) && (
            <div
              className="flex w-1/2 lg:w-fit items-center bg-transparent gap-4 relative z-[3] lg:self-end justify-center lg:justify-end"
            >
              <HeadPanel />
            </div>
          )}
        </HeadAreaWrapper>
        {requestedUser.description && (
          <div className="flex lg:hidden w-full mt-2">
            <UserDescription description={requestedUser.description} />
          </div>
        )}
      </div>
      <div className="w-full h-full relative">
        {children}
      </div>
    </>
  );
}, "HeadLayout")