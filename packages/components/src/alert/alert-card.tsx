import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Link } from "@tanstack/react-router";
import { AlertClose } from "./alert-close";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { Suspense } from "react";
import { USER_URL } from "@repo/shared/constants/routes";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export const AlertCard = ({
  title, id, creator, link, created_at,
}: AlertEntity) => {
  return (
    <div className="flex group select-none gap-4 items-center w-full relative rounded-lg min-h-12 max-h-32 px-4 bg-primary-color">
      <Typography
        textColor="shark_white"
        textSize="medium"
        className="font-[Minecraft]"
      >
        {title} {link && <Link to={link} target="_blank" rel="noopener noreferrer">
          <span className="text-[18px] text-green-500">
            (ссылка)
          </span>
        </Link>}
      </Typography>
      <span className="font-[Minecraft] text-[12px] text-shark-50">
        ⏺
      </span>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[16px] w-[16px]" />}>
          <Link to={USER_URL + creator}>
            <Avatar nickname={creator} propWidth={16} propHeight={16} />
          </Link>
        </Suspense>
        <Link to={USER_URL + creator}>
          <UserNickname nickname={creator} className="text-[14px]" />
        </Link>
      </div>
      <AlertClose />
    </div>
  );
};