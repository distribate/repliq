import { requestedUserIsSameAtom, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from "#components/user/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { onChange, updateAvatarAction, updateAvatarAtom } from "../models/cover-avatar.model";

const userCoverAvatarVariants = cva(`flex items-center group relative justify-center md:size-[160px] size-[80px]`, {
  variants: {
    variant: {
      full: "size-[160px]",
      compact: "size-[80px]"
    }
  }
})

type UserCoverAvatarProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof userCoverAvatarVariants>

export const UserCoverAvatarWrapper = ({ variant, className, ...props }: UserCoverAvatarProps) => {
  return <div className={userCoverAvatarVariants({ variant, className })} {...props} />
}

const UpdateAvatar = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div className="absolute inset-0 duration-300 rounded-sm bg-black/50 backdrop-blur-md z-[1] group-hover:opacity-100 opacity-0">
        <div onClick={() => ref?.current?.click()} className="flex cursor-pointer justify-center items-center w-full h-full">
          <Upload size={26} />
          <input type="file" multiple={false} ref={ref} className="hidden" onChange={e => onChange(ctx, e)} />
        </div>
      </div>
      {ctx.spy(updateAvatarAtom) && (
        <div className="flex w-full items-center justify-center absolute right-0 z-[1] left-0 -bottom-4">
          <Button onClick={() => updateAvatarAction(ctx)} variant="positive">
            <Typography className="text-shark-50">Сохранить</Typography>
          </Button>
        </div>
      )}
    </>
  )
}, "UpdateAvatar")

export const UserCoverAvatar = reatomComponent<UserCoverAvatarProps>(({ ctx, className, variant }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return null;
  
  const isOwner = ctx.spy(requestedUserIsSameAtom)
  
  return (
    <UserCoverAvatarWrapper variant={variant} className={className}>
      {isOwner && <UpdateAvatar />}
      <Avatar propHeight={160} propWidth={160} withStatus={true} nickname={nickname} />
    </UserCoverAvatarWrapper>
  )
})