import { requestedUserAtom, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from "#components/user/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";

const userCoverAvatarVariants = cva(`flex items-center group relative justify-center md:size-[160px] size-[112px]`, {
  variants: {
    variant: {
      full: "size-[160px]",
      compact: "size-[112px]"
    }
  }
})

type UserCoverAvatarProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof userCoverAvatarVariants>

export const UserCoverAvatarWrapper = ({ variant, className, ...props }: UserCoverAvatarProps) => {
  return <div className={userCoverAvatarVariants({ variant, className })} {...props} />
}

export const UserCoverAvatar = reatomComponent<UserCoverAvatarProps>(({ ctx, className, variant }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return null;

  const user = ctx.spy(requestedUserAtom)

  if (!user) return null;

  return (
    <UserCoverAvatarWrapper variant={variant} className={className}>
      <Dialog>
        <DialogTrigger>
          <Avatar url={user.avatar} propHeight={160} propWidth={160} withStatus={true} nickname={nickname} />
        </DialogTrigger>
        <DialogContent withClose={false} className="flex overflow-visible flex-col gap-4 !p-0 lg:!min-w-fit bg-transparent items-center justify-center">
          <div className="flex h-5/6 w-full aspect-square">
            <Avatar url={user.avatar} rounded="medium" className=" *:w-full *:h-full" nickname={nickname} />
          </div>
          <DialogClose>
            <Button className="px-6 bg-shark-50">
              <Typography className="text-lg font-semibold text-shark-950">
                Закрыть
              </Typography>
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </UserCoverAvatarWrapper>
  )
})