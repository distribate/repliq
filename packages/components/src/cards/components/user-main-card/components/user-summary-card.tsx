import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserRealName } from "#user/components/real-name/real-name.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { userCardQuery } from "../queries/user-main-card-query.ts";
import Glass from "@repo/assets/images/minecraft/glass.webp";
import dayjs from "dayjs";
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { UserSummaryCardPrivated } from "./user-summary-card-privated.tsx";
import { UserSummaryCardLimited } from "./user-summary-card-limited.tsx";
import { UserSummaryCardSkeleton } from "./user-summary-card-skeleton.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";

export const UserSummaryCard = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { data: userCard, isLoading, isError } = userCardQuery(nickname);

  if (isLoading) return <UserSummaryCardSkeleton />;

  if (!userCard || isError) return null;

  const userData = userCard.data;
  const userStatus = userCard.status;

  const main = userData
  const favoriteItem = userData?.favorite_item;

  const stats = {
    friendsCount: userData?.friends_count,
    threadsCount: userData?.threads_count
  }

  const createdInForum = dayjs(main?.registration_dates?.forum)
    .format("На форуме с: DD.MM.YYYY");

  const createdInServer = dayjs(main?.registration_dates?.server)
    .format("В игре с: DD.MM.YYYY");

  return (
    <div
      className="flex flex-col h-[512px] gap-y-4 relative w-full rounded-lg p-4 bg-shark-950 border-[1px] border-white/10 items-center"
    >
      {userStatus === 'blocked' && <UserSummaryCardPrivated />}
      {userStatus === 'private' && <UserSummaryCardPrivated />}
      {userStatus === 'banned' && <UserSummaryCardLimited title="Пользователь забанен" />}
      {userStatus === 'default' && (
        <>
          {main && (
            <>
              <div className="flex items-center gap-4 w-full">
                <div className="flex relative justify-center p-2 items-center">
                  <div className="z-1 absolute w-full h-full right-0 left-0 bottom-0 top-0">
                    <ImageWrapper
                      propSrc={Glass}
                      propAlt={`nickname`}
                      width={104}
                      height={104}
                    />
                  </div>
                  <Link to={USER_URL + nickname}>
                    <Avatar
                      nickname={nickname}
                      propWidth={88}
                      propHeight={88}
                      className="z-2 relative !rounded-none"
                    />
                  </Link>
                </div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-col">
                    <UserNickname nickname={nickname} nicknameColor={`#ffffff`} />
                    {main.real_name && <UserRealName real_name={main.real_name} />}
                  </div>
                  <div className="w-fit">
                    <UserDonate donate={main.donate} favoriteItemId={favoriteItem?.id ?? null} />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-y-4 items-center w-full">
                <div className="flex flex-col gap-y-1 w-full">
                  <Typography>Описание</Typography>
                  <div className="flex bg-shark-900 rounded-sm overflow-hidden px-2 py-0.5">
                    <Typography className="whitespace-normal" textSize="small">
                      {main.description ?? "нет описания"}
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
        </>
      )}
    </div>
  );
};

{/* {(favoriteItem && favoriteItem.image) && (
            <>
              <ImageWrapper
                className="absolute -top-10 rotate-45 -right-10"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -top-10 -rotate-45 -left-10"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -bottom-8 -rotate-45 -right-8"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -bottom-8 rotate-45 -left-8"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
            </>
          )} */}