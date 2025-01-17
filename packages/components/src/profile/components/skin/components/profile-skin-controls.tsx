"use client";

import { Icon } from "@repo/shared/ui/icon/icon.tsx";
import { ArrowDownFromLine, RotateCw } from "lucide-react";
import { useSkinStateChange } from "../hooks/use-skin-animation.ts";
import { skinAnimationQuery } from "../queries/skin-query.ts";
import { SKIN_ANIMATIONS } from "../constants/skin-animations.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { skinClient } from "@repo/shared/api/skin-client.ts";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useState } from "react";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
import { cva, VariantProps } from "class-variance-authority";

const profileSkinControlVariants = cva("flex items-center justify-center cursor-pointer border border-shark-800 p-2 rounded-lg h-[50px] w-[50px]", {
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

export const ProfileSkinDownloadLink = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const downloadUrl = skinClient["download-skin"][":nickname"].$url({
    param: { nickname },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <div
          className="flex items-center justify-center cursor-pointer border border-shark-800 p-2 rounded-lg h-[50px] min-w-[50px] w-[50px]"
          title="Скачать скин"
        >
          <ArrowDownFromLine size={20} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <ConfirmationActionModalTemplate title="Скачать скин?">
          <a
            href={downloadUrl.href}
            onClick={() => setDialogOpen(false)}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="bg-shark-50 flex items-center px-6 justify-center rounded-md"
          >
            <Typography className="text-shark-950 text-base font-medium">
              Скачать
            </Typography>
          </a>
          <DialogClose>
            <ConfirmationButton actionType="cancel" title="Отмена" />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  )
}

export const ProfileSkinControls = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { data: skinAnimation } = skinAnimationQuery();
  const { updateSkinStateMutation } = useSkinStateChange();

  return (
    <div className="flex items-center w-full justify-between gap-4">
      <div className="flex items-center justify-start gap-4 w-full">
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
      <ProfileSkinDownloadLink nickname={nickname} />
    </div>
  );
};