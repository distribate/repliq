import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { CoverArea } from "./cover-area.tsx";
import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { coverQuery } from "#profile/components/cover/queries/cover-query.ts";
import { imageCoverQuery } from "#profile/components/cover/queries/image-cover-query.ts";
import type { UserDetailed, UserShorted } from "@repo/types/entities/user-type.ts";
import dynamic from "next/dynamic";

type UserCoverProps = {
  requestedUser: UserDetailed | UserShorted;
};

const UserCoverWatermark = dynamic(() =>
  import(
    "@repo/components/src/profile/components/cover/components/cover-watermark.tsx"
  ).then((m) => m.UserCoverWatermark),
);

export const UserCover = ({
  requestedUser
}: UserCoverProps) => {
  const { donate, nickname, preferences } = requestedUser;

  const { data: coverQueryState } = coverQuery();
  const { data: url, isLoading } = imageCoverQuery(nickname);

  const preferOutline = preferences?.cover_outline_visible ?? false;
  const coverOutline = donate && preferOutline ? donate : "default";

  const backgroundImage = url ? `url(${url})` : "";
  const backgroundColor = url ? "transparent" : "gray";
  const imageHeight = coverQueryState.inView ? 168 : 76;

  return (
    <CoverArea
      variant={coverQueryState.inView ? "full" : "compact"}
      backgroundColor={backgroundColor}
      outline={coverOutline}
      style={{ backgroundImage }}
    >
      {!url && !isLoading && <UserCoverWatermark />}
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div className="flex flex-col gap-y-2 lg:flex-row gap-x-6 z-[4] relative items-center lg:items-start">
        <Avatar
          variant="page"
          propHeight={imageHeight}
          propWidth={imageHeight}
          withStatus={true}
          nickname={requestedUser.nickname}
        />
        <UserCoverMainInfo nickname={requestedUser.nickname} />
      </div>
      <UserCoverPanel
        requestedNickname={requestedUser.nickname}
        variant={coverQueryState.inView ? "end" : "default"}
      />
    </CoverArea>
  );
};
