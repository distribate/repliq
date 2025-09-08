import { requestedUserAtom, requestedUserIsSameAtom } from "#components/profile/main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { AvatarsList } from "#components/user/components/avatar/components/avatars-list";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { deleteAvatar, openUserCoverAvatarDialog, prefetchUserAvatarsAction, setAvatarAsMain, userCoverAvatarDialogIsOpenAtom, userCoverAvatarTargetAtom, userCoverSelectedAvatarAtom } from "../models/avatar.model";
import { IconDotsVertical, IconTrash, IconUser } from "@tabler/icons-react";

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
  const isOwner = ctx.spy(requestedUserIsSameAtom)

  const data = ctx.spy(userCoverSelectedAvatarAtom);

  return (
    <div className="relative">
      <Avatar
        url={data}
        className="*:w-full *:h-full"
        nickname={""}
      />
      {isOwner && (
        <div className="absolute right-2 top-2">
          <AvatarOptions target={data} />
        </div>
      )}
    </div>
  )
}, "SelectedAvatar")

const AvatarOptions = reatomComponent<{ target: string }>(({ ctx, target }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="items-center flex justify-center w-8 h-8 bg-shark-950/80 rounded-lg">
        <IconDotsVertical size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Button
            className="flex justify-start gap-2 w-full"
            onClick={() => deleteAvatar(ctx, target)}
            disabled={ctx.spy(deleteAvatar.statusesAtom).isPending}
          >
            <IconTrash size={24} />
            <Typography className="text-base font-semibold">
              Удалить
            </Typography>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            className="w-full"
            onClick={() => setAvatarAsMain(ctx, target)}
            disabled={ctx.spy(setAvatarAsMain.statusesAtom).isPending}
          >
            <IconUser size={24} />
            <Typography className="text-base font-semibold">
              Сделать основной
            </Typography>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}, "AvatarOptions")

const listVariant = cva(`
  flex sm:justify-center justify-start items-center gap-2 [&::-webkit-scrollbar]:h-1.5 overflow-x-auto overflow-y-hidden sm:w-full 
  h-24 max-h-24
`)

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
    openUserCoverAvatarDialog(ctx, value)
  }

  return (
    <UserCoverAvatarWrapper variant={variant} className={className}>
      <Dialog open={ctx.spy(userCoverAvatarDialogIsOpenAtom)} onOpenChange={handle}>
        <DialogTrigger
          asChild
          className="cursor-pointer"
          onMouseUp={() => {
            prefetchUserAvatarsAction(ctx, nickname)
          }}
        >
          <Avatar
            url={isError ? null : avatar}
            propHeight={160}
            propWidth={160}
            withStatus={true}
            nickname={nickname}
            className="min-h-40 h-40 max-h-40 aspect-square"
          />
        </DialogTrigger>
        <DialogContent
          withClose={false}
          className="flex flex-col gap-2 overflow-visible !p-0 lg:!min-w-fit bg-transparent items-center justify-center"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex flex-col gap-4 w-full aspect-square sm:w-[clamp(290px,37.5vw,960px)]">
            <SelectedAvatar />
            <div
              className="flex flex-nowrap w-full justify-start 
                sm:justify-center items-center gap-2 pb-1.5 [&::-webkit-scrollbar]:h-1.5 
                overflow-x-auto overflow-y-hidden sm:w-full h-26 max-h-26"
            >
              <AvatarsList />
            </div>
          </div>
          <DialogClose asChild>
            <Button className="bg-shark-50 w-2/3 sm:w-1/3">
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