import { requestedUserAtom, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from "#components/user/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@repo/ui/src/components/dialog";
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

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Image failed to load: ${url}`));

    img.src = url;
  });
}

export const UserCoverAvatar = reatomComponent<UserCoverAvatarProps>(({ ctx, className, variant }) => {
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const cancelledRef = useRef(false)

  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return null;

  const user = ctx.spy(requestedUserAtom)
  if (!user) return null;

  const avatar = user.avatar;

  useEffect(() => {
    if (!avatar) return;

    cancelledRef.current = false

    preloadImage(avatar)
      .then(() => {
        if (!cancelledRef.current) setIsError(false)
      })
      .catch(() => {
        if (!cancelledRef.current) setIsError(true)
      })
    
    return () => {
      cancelledRef.current = true;
    };
  }, [avatar])

  const handle = (v: boolean) => {
    if (!avatar || isError) return;
    setOpen(v)
  }

  return (
    <UserCoverAvatarWrapper variant={variant} className={className}>
      <Dialog open={open} onOpenChange={handle}>
        <DialogTrigger asChild className="cursor-pointer">
          <Avatar url={isError ? null : avatar} propHeight={160} propWidth={160} withStatus={true} nickname={nickname} />
        </DialogTrigger>
        <DialogContent
          withClose={false}
          className="flex overflow-visible flex-col gap-2 !p-0 lg:!min-w-fit bg-transparent items-center justify-center"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <div className="aspect-square w-[clamp(200px,37.5vw,960px)]">
            <Avatar
              url={avatar}
              rounded="medium"
              className="*:w-full *:h-full"
              nickname={nickname}
            />
          </div>
          <DialogClose className="w-full sm:w-1/3">
            <Button className="w-full bg-shark-50">
              <Typography className="text-lg font-semibold text-shark-950">
                Закрыть
              </Typography>
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </UserCoverAvatarWrapper>
  )
}, "UserCoverAvatar")