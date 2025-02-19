import { Icon } from "@repo/shared/ui/icon/icon.tsx";
import { ArrowDownFromLine, RotateCw } from "lucide-react";
import { useSkinStateChange } from "../hooks/use-skin-animation.ts";
import { skinAnimationQuery } from "../queries/skin-query.ts";
import { SKIN_ANIMATIONS } from "../constants/skin-animations.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { skinClient } from "@repo/shared/api/minecraft-client.ts";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useState } from "react";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
import { cva, VariantProps } from "class-variance-authority";
import { Link } from "@tanstack/react-router";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Button } from "@repo/ui/src/components/button.tsx";

const profileSkinControlVariants = cva("flex items-center justify-center cursor-pointer border border-shark-800 rounded-lg h-[46px] w-[46px]", {
  variants: {
    variant: {
      default: "bg-transparent",
      active: "bg-shark-700/60"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type ProfileSkinControlProps = React.HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof profileSkinControlVariants>

const ProfileSkinControl = ({ variant, className, ...props }: ProfileSkinControlProps) => {
  return (
    <div
      className={profileSkinControlVariants({ variant, className })}
      {...props}
    />
  )
}

export const ProfileSkinHowToChange = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-shark-50 w-full h-[46px]">
          <Typography textSize="medium" className="text-shark-950">
            Как изменить скин?
          </Typography>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-y-4 w-full items-center justify-center">
          <Typography variant="dialogTitle">
            Как изменить скин?
          </Typography>
          <div className="flex flex-col gap-y-2 p-2 w-full">
            <Typography textSize="medium">
              Чтобы изменить скин вам нужно зайти на сервер и ввести команду:
            </Typography>
            <Typography textSize="medium">
              <pre className="bg-shark-900 px-2 py-1 rounded-lg w-fit">
                <code>/skin set [никнейм]</code>
              </pre>
            </Typography>
          </div>
          <div className="flex items-center w-full p-2">
            <Link to="https://fasberry.su/wiki?tab=skin" target="_blank">
              <Button state="default">
                <Typography textSize="medium">
                  Больше о формировании скина
                </Typography>
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const ProfileSkinDownloadLink = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const downloadUrl = skinClient.skin["download-skin"][":nickname"].$url({
    param: { nickname },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center gap-2 w-full">
          <Button variant="positive" className="w-full h-[46px]">
            <Typography textSize="medium" className="text-shark-50">
              Скачать скин
            </Typography>
          </Button>
          <Button variant="positive" className="h-[46px] w-[46px]">
            <ArrowDownFromLine size={20} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <ConfirmationActionModalTemplate title="Скачать скин?">
          <Link
            to={downloadUrl.href}
            onClick={() => setDialogOpen(false)}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="bg-shark-50 flex items-center px-6 justify-center rounded-md"
          >
            <Typography className="text-shark-950 text-base font-medium">
              Скачать
            </Typography>
          </Link>
          <DialogClose>
            <ConfirmationButton actionType="cancel" title="Отмена" />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  )
}

export const ProfileSkinControls = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { nickname: currentUser } = getUser()
  const { data: skinAnimation } = skinAnimationQuery();
  const { updateSkinStateMutation } = useSkinStateChange();

  return (
    <div className="flex flex-col items-center w-full justify-center gap-4">
      <div className="flex items-center justify-center gap-4 w-full">
        {SKIN_ANIMATIONS.map((control, i) => (
          <ProfileSkinControl
            key={i}
            onClick={() => updateSkinStateMutation.mutate({ animation: control.animation })}
            variant={skinAnimation.animation === control.animation ? "active" : "default"}
          >
            <Icon name={control.icon} className="text-xl" />
          </ProfileSkinControl>
        ))}
        <ProfileSkinControl
          key="rotate"
          onClick={() => updateSkinStateMutation.mutate({ rotate: !skinAnimation.rotate })}
          variant={skinAnimation.rotate ? "active" : "default"}
        >
          <RotateCw size={20} />
        </ProfileSkinControl>
      </div>
      <div className="flex flex-col items-center justify-end gap-4 w-full">
        {nickname === currentUser && (
          <ProfileSkinHowToChange />
        )}
        <ProfileSkinDownloadLink nickname={nickname} />
      </div>
    </div>
  );
};