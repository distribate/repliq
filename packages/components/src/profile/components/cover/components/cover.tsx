import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { CoverArea } from "./cover-area.tsx";
import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { coverQuery } from "#profile/components/cover/queries/cover-query.ts";
import { requestedUserQuery } from "../queries/requested-user-query.ts";
import { UserCoverWatermark } from "./cover-watermark.tsx";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

type UserCoverProps = {
  nickname: string
};

export const UserCover = ({
  nickname: requestedUserNickname
}: UserCoverProps) => {
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname);
  const { data: { inView } } = coverQuery();

  if (!requestedUser) return null;

  const { donate, preferences, nickname, cover_image } = requestedUser

  const preferOutline = preferences?.cover_outline_visible ?? false;
  const coverOutline = donate && preferOutline ? donate : "default";

  const backgroundImage = cover_image ? `url(${cover_image})` : "";
  const backgroundColor = cover_image ? "transparent" : "gray";
  const imageHeight = inView ? 168 : 76;

  return (
    <CoverArea
      variant={inView ? "full" : "compact"}
      backgroundColor={backgroundColor}
      outline={coverOutline}
      style={{ backgroundImage }}
    >
      {!cover_image && <UserCoverWatermark />}
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div className="flex flex-col gap-y-2 lg:flex-row gap-x-6 z-[4] relative items-center lg:items-start">
        <Suspense fallback={<Skeleton className={`w-[${imageHeight}px] h-[${imageHeight}px]`} />}>
          <div className={`lg:hidden flex w-[120px] h-[120px]`}>
            <Avatar
              variant="page"
              propHeight={imageHeight}
              propWidth={imageHeight}
              withStatus={true}
              nickname={nickname}
            />
          </div>
          <div className={`hidden lg:flex w-[${imageHeight}px] h-[${imageHeight}px]`}>
            <Avatar
              variant="page"
              propHeight={imageHeight}
              propWidth={imageHeight}
              withStatus={true}
              nickname={nickname}
            />
          </div>
        </Suspense>
        <UserCoverMainInfo nickname={nickname} />
      </div>
      <UserCoverPanel requestedNickname={nickname} variant={inView ? "end" : "default"} />
    </CoverArea>
  );
};