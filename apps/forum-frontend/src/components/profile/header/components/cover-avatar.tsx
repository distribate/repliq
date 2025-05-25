import { requestedUserParamAtom } from "#components/profile/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { coverAtom } from "../models/cover.model";
import { Avatar } from "#components/user/avatar/components/avatar";

export const COVER_AVATAR_HEIGHT = [76, 168]

export const UserCoverAvatar = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return null;

  const imageHeight = ctx.spy(coverAtom).inView ? COVER_AVATAR_HEIGHT[1] : COVER_AVATAR_HEIGHT[0];

  return (
    <>
      <div className={`lg:hidden flex w-[120px] h-[120px]`}>
        <Avatar variant="page" propHeight={imageHeight} propWidth={imageHeight} withStatus={true} nickname={nickname} />
      </div>
      <div className={`hidden lg:flex w-[${imageHeight}px] h-[${imageHeight}px]`}>
        <Avatar variant="page" propHeight={imageHeight} propWidth={imageHeight} withStatus={true} nickname={nickname} />
      </div>
    </>
  )
})