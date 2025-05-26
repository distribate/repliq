import { requestedUserParamAtom } from "#components/profile/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { coverAtom } from "../models/cover.model";
import { Avatar } from "#components/user/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const userCoverAvatarVariants = cva(`flex items-center justify-center md:size-[160px] size-[80px]`, {
  variants: {
    variant: {
      full: "size-[160px]",
      compact: "size-[80px]"
    }
  }
})

type UserCoverAvatarProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof userCoverAvatarVariants>

export const UserCoverAvatar = reatomComponent<UserCoverAvatarProps>(({ ctx, className, variant }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return null;

  const imageSizes = ctx.spy(coverAtom).inView ? 160 : 80

  return (
    <div className={userCoverAvatarVariants({ variant, className })}>
      <Avatar propHeight={imageSizes} propWidth={imageSizes} withStatus={true} nickname={nickname} />
    </div>
  )
})