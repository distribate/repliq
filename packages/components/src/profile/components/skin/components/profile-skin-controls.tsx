"use client";

import { Button } from "@repo/ui/src/components/button.tsx";
import { Icon } from "@repo/shared/ui/icon/icon.tsx";
import { ArrowDownFromLine, RotateCw } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { useSkinStateChange } from "../hooks/use-skin-animation.ts";
import { skinAnimationQuery } from "../queries/skin-query.ts";
import { useRouter } from "next/navigation";
import { SKIN_ANIMATIONS } from "../constants/skin-animations.ts";
import { SKIN_DOWNLOAD_SKIN } from "@repo/shared/constants/routes.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";

export const ProfileSkinControls = ({ uuid }: Pick<UserEntity, "uuid">) => {
  const { push } = useRouter();
  const { data: skinAnimation } = skinAnimationQuery();
  const { updateSkinStateMutation } = useSkinStateChange();
  
  return (
    <div className="flex flex-col gap-y-2">
      {SKIN_ANIMATIONS.map((control, i) => (
        <Button
          key={i}
          className="h-[40px] w-[40px]"
          state={
            skinAnimation.animation === control.animation ? "active" : "default"
          }
          onClick={() =>
            updateSkinStateMutation.mutate({ animation: control.animation })
          }
        >
          <Icon name={control.icon} className="text-xl" />
        </Button>
      ))}
      <Button
        className="h-[40px] w-[40px]"
        state={skinAnimation.rotate ? "active" : "default"}
        title="Переключить вращение"
        onClick={() =>
          updateSkinStateMutation.mutate({ rotate: !skinAnimation.rotate })
        }
      >
        <RotateCw size={20} />
      </Button>
      <Separator />
      <Button
        className="h-[40px] w-[40px]"
        state="default"
        title="Скачать скин"
        onClick={() => push(SKIN_DOWNLOAD_SKIN + uuid)}
      >
        <ArrowDownFromLine size={20} />
      </Button>
    </div>
  );
};
