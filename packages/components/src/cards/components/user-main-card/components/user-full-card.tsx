import { TiltCard } from "@repo/ui/src/components/tilt-card.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/components/nickname.tsx";
import { UserRealName } from "#user/components/real-name/components/real-name.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { UserMainCard } from "../types/user-main-card-types.ts";
import { userCardQuery } from "../queries/user-main-card-query.ts";
import Glass from "@repo/assets/images/minecraft/glass.webp";
import dayjs from "dayjs";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

const UserFullCardSkeleton = () => {
  return (
    <div className="flex flex-col h-[512px] gap-y-4 relative w-full rounded-lg p-4 bg-shark-950 border-[1px] border-white/10 items-center">
      <div className="flex items-center gap-4 w-full">
        <div className="flex relative justify-center p-2 items-center">
          <Skeleton className="w-[104px] h-[104px]" />
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-y-4 items-center w-full">
        <div className="flex flex-col gap-y-1 w-full">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex flex-col gap-y-1 w-full">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-72" />
        </div>
      </div>
      <Separator />
    </div>
  );
};

export const UserFullCard = ({ nickname }: UserMainCard) => {
  const { data: userCard, isLoading } = userCardQuery(nickname);

  if (isLoading) return <UserFullCardSkeleton />;
  if (typeof userCard === "string") return;

  if (!userCard) return null;

  const main = userCard.user;
  const favoriteItemImage = userCard.favoriteItem;
  const stats = userCard.stats;

  const createdInForum = dayjs(main.created_at).format(
    "На форуме с: DD.MM.YYYY",
  );
  const createdInServer = dayjs(stats.joined?.regDate).format(
    "В игре с: DD.MM.YYYY",
  );

  return (
    <TiltCard
      tiltMaxAngleY={10}
      tiltMaxAngleX={10}
      className="flex flex-col h-[512px] gap-y-4 relative w-full rounded-lg p-4 bg-shark-950 border-[1px] border-white/10 items-center"
    >
      {!isLoading && (
        <>
          {favoriteItemImage && (
            <>
              <ImageWrapper
                className="absolute -top-10 rotate-45 -right-10"
                propSrc={favoriteItemImage.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -top-10 -rotate-45 -left-10"
                propSrc={favoriteItemImage.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -bottom-8 -rotate-45 -right-8"
                propSrc={favoriteItemImage.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -bottom-8 rotate-45 -left-8"
                propSrc={favoriteItemImage.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
            </>
          )}
          <div className="flex items-center gap-4 w-full">
            <div className="flex relative justify-center p-2 items-center">
              <div className="z-1 absolute w-full h-full right-0 left-0 bottom-0 top-0">
                <ImageWrapper
                  propSrc={Glass.src}
                  propAlt={`nickname`}
                  width={104}
                  height={104}
                />
              </div>
              <Avatar
                nickname={nickname}
                propWidth={88}
                propHeight={88}
                className="z-2 relative !rounded-none"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col">
                <UserNickname nickname={nickname} nicknameColor={`#ffffff`} />
                {main.real_name && <UserRealName real_name={main.real_name} />}
              </div>
              <div className="w-fit">
                <UserDonate nickname={nickname} />
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-y-4 items-center w-full">
            <div className="flex flex-col gap-y-1 w-full">
              <Typography>Описание</Typography>
              <div className="flex bg-shark-900 rounded-sm overflow-hidden px-2 py-0.5">
                <Typography className="whitespace-normal" textSize="small">
                  {main.description}
                </Typography>
              </div>
            </div>
            <div className="flex flex-col gap-y-1 w-full">
              <Typography textSize="small">Участник Fasberry:</Typography>
              <div className="flex items-center gap-2">
                <Typography className="text-shark-300" textSize="small">
                  {createdInServer}
                </Typography>
                <Separator orientation="vertical" />
                <Typography className="text-shark-300" textSize="small">
                  {createdInForum}
                </Typography>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-y-2 w-full">
            <Typography>Статистика</Typography>
            <div className="flex items-center gap-1 w-full">
              <Typography textSize="small">Друзей:</Typography>
              <Typography className="truncate" textSize="small">
                {stats.friendsCount}
              </Typography>
            </div>
            <div className="flex items-center gap-1 w-full">
              <Typography textSize="small">Тем:</Typography>
              <Typography className="truncate" textSize="small">
                {stats.threadsCount}
              </Typography>
            </div>
          </div>
        </>
      )}
    </TiltCard>
  );
};
