"use client";

import { BanDetails } from "@repo/lib/helpers/get-ban-details.ts";
import Image from "next/image";
import MissingTexture from "@repo/assets/images/minecraft/missing_texture.webp";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { CoverArea } from "#profile/components/cover/components/cover-area.tsx";

export const UserBanned = ({ nickname, time }: BanDetails) => {
  return (
    <div className="flex flex-col w-full h-full">
      <CoverArea variant="full" backgroundColor="gray" outline="default">
        <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
        <div className="flex gap-x-6 z-[3] relative items-start">
          <Image
            src={MissingTexture}
            alt=""
            height={168}
            width={168}
            className="rounded-md"
          />
        </div>
      </CoverArea>
      <div className="flex flex-col gap-4 justify-center items-center py-12 px-2">
        <div className="flex flex-col items-center gap-2 w-full">
          <Typography textSize="very_big" textColor="shark_white">
            Пользователь {nickname} был заблокирован за нарушение правил
            проекта.
          </Typography>
          <Typography textSize="large" textColor="gray">
            Вернется к игре {dayjs(time).toNow()}
          </Typography>
        </div>
      </div>
    </div>
  );
};
