import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from "#components/user/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { AvatarsList } from "#components/user/avatar/components/avatars-list";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { deleteAvatar, openUserCoverAvatarDialog, userCoverAvatarDialogIsOpenAtom, userCoverSelectedAvatarAtom } from "../models/avatar.model";
import { IconDotsVertical } from "@tabler/icons-react";

const userCoverAvatarVariants = cva(
  `flex items-center group relative justify-center md:size-[160px] size-[112px]`, {
  variants: {
    variant: {
      full: "size-[160px]",
      compact: "size-[112px]"
    }
  }
})

type UserCoverAvatarProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof userCoverAvatarVariants>

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

const SelectedAvatar = reatomComponent(({ ctx }) => {
  const data = ctx.spy(userCoverSelectedAvatarAtom);

  return (
    <div className="relative">
      <Avatar
        url={data}
        rounded="medium"
        className="*:w-full *:h-full"
        nickname={""}
      />
      <div className="absolute right-2 top-2">
        <AvatarOptions target={data} />
      </div>
    </div>
  )
}, "SelectedAvatar")

const AvatarOptions = reatomComponent<{ target: string }>(({ ctx, target }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconDotsVertical size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent asChild>
        <Button
          className="text-lg"
          onClick={() => deleteAvatar(ctx, target)}
          disabled={ctx.spy(deleteAvatar.statusesAtom).isPending}
        >
          Удалить
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}, "AvatarOptions")

export const UserCoverAvatar = reatomComponent<UserCoverAvatarProps>(({ ctx, className, variant }) => {
  const cancelledRef = useRef(false)
  const [isError, setIsError] = useState(false);

  const user = ctx.spy(requestedUserAtom)
  if (!user) return null;

  const { avatar, nickname } = user;

  useEffect(() => {
    if (!avatar) return;

    cancelledRef.current = false

    preloadImage(avatar)
      .then(() => !cancelledRef.current && setIsError(false))
      .catch(() => !cancelledRef.current && setIsError(true))

    return () => {
      cancelledRef.current = true;
    };
  }, [avatar])

  const handle = (value: boolean) => {
    if (isError || !avatar) return;
    openUserCoverAvatarDialog(ctx, value, user.nickname)
  }

  return (
    <UserCoverAvatarWrapper variant={variant} className={className}>
      <Dialog open={ctx.spy(userCoverAvatarDialogIsOpenAtom)} onOpenChange={handle}>
        <DialogTrigger asChild className="cursor-pointer">
          <Avatar
            url={isError ? null : avatar}
            propHeight={160}
            propWidth={160}
            withStatus={true}
            nickname={nickname}
          />
        </DialogTrigger>
        <DialogContent
          withClose={false}
          className="flex flex-col gap-2 overflow-visible !p-0 lg:!min-w-fit bg-transparent items-center justify-center"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex flex-col gap-4 aspect-square w-[clamp(200px,37.5vw,960px)]">
            <SelectedAvatar />
            <AvatarsList />
          </div>
          <DialogClose className="w-2/3 sm:w-1/3">
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