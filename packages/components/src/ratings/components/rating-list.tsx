import { Skeleton } from "@repo/ui/src/components/skeleton";
import { RatingBelkoinCard, RatingBelkoinCardProps, RatingCharismCard, RatingCharismCardProps, RatingLandsCard, RatingLandsCardProps, RatingParkourCard, RatingParkourCardProps, RatingPlaytimeCard, RatingPlaytimeCardProps, RatingReputationCard, RatingReputationCardProps } from "./rating-cards";
import { ratingQuery } from "../queries/ratings-query"
import Events from '@repo/assets/gifs/minecraft-boime.gif'
import { Typography } from "@repo/ui/src/components/typography";
import { useInView } from "react-intersection-observer";
import { useMutationState } from "@tanstack/react-query";
import { UPDATE_RATING_MUTATION_KEY, useUpdateRating } from "#ratings/hooks/use-update-ratings.ts";
import { useEffect } from "react";
import { ratingFilterQuery } from "#ratings/queries/ratings-filter-query.ts";
import { Separator } from "@repo/ui/src/components/separator";

const RatingsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}

const RatingIsEmpty = () => {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <img src={Events} alt="" width={256} height={256} />
      <Typography className="text-xl font-bold text-shark-50">
        Рейтингов пока нет
      </Typography>
    </div>
  )
}

const RatingListParkourHeader = () => {
  return (
    <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full px-4">
      <Typography textSize="large" textColor="gray">
        #
      </Typography>
      <Typography textSize="large" textColor="gray">
        Игрок
      </Typography>
      <Typography textSize="large" textColor="gray">
        Карта
      </Typography>
      <Typography textSize="large" textColor="gray">
        Счет
      </Typography>
    </div>
  )
}

const RatingListCharismHeader = () => {
  return (
    <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full px-4">
      <Typography textSize="large" textColor="gray">
        #
      </Typography>
      <Typography textSize="large" textColor="gray">
        Игрок
      </Typography>
      <Typography textSize="large" textColor="gray">
        Харизмы
      </Typography>
    </div>
  )
}

const RatingListBelkoinHeader = () => {
  return (
    <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full px-4">
      <Typography textSize="large" textColor="gray">
        #
      </Typography>
      <Typography textSize="large" textColor="gray">
        Игрок
      </Typography>
      <Typography textSize="large" textColor="gray">
        Белкоинов
      </Typography>
    </div>
  )
}

const RatingListReputationHeader = () => {
  return (
    <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full px-4">
      <Typography textSize="large" textColor="gray">
        #
      </Typography>
      <Typography textSize="large" textColor="gray">
        Игрок
      </Typography>
      <Typography textSize="large" textColor="gray">
        Репутация
      </Typography>
    </div>
  )
}

const RatingListPlaytimeHeader = () => {
  return (
    <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full px-4">
      <Typography textSize="large" textColor="gray">
        #
      </Typography>
      <Typography textSize="large" textColor="gray">
        Игрок
      </Typography>
      <Typography textSize="large" textColor="gray">
        Суммарное время
      </Typography>
    </div>
  )
}

const RatingListLandsHeader = () => {
  return (
    <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full px-4">
      <Typography textSize="large" textColor="gray">
        #
      </Typography>
      <Typography textSize="large" textColor="gray">
        Территория
      </Typography>
      <Typography textSize="large" textColor="gray">
        Кол-во чанков
      </Typography>
      <Typography textSize="large" textColor="gray">
        Тип
      </Typography>
    </div>
  )
}

export const RatingList = () => {
  const { data, isLoading, isError } = ratingQuery({
    type: "playtime", ascending: String(false)
  })
  const { data: { type: currentType } } = ratingFilterQuery()
  const { updateRatingMutation } = useUpdateRating()

  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const mutData = useMutationState({
    filters: { mutationKey: UPDATE_RATING_MUTATION_KEY },
    select: m => m.state.status
  })

  const ratingData = data?.data;
  const ratingMeta = data?.meta;
  const hasMore = ratingMeta?.hasNextPage;
  const isLoadingUpdated = mutData[mutData.length - 1] === "pending";

  useEffect(() => {
    if (inView && hasMore) updateRatingMutation.mutate({ type: "update-cursor" });
  }, [inView, hasMore]);

  if (isLoading) return <RatingsListSkeleton />

  if (isError) return <RatingIsEmpty />;

  if (!ratingData) return null;

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {isLoadingUpdated ? (
        <RatingsListSkeleton />
      ) : (
        <>
          {currentType === 'parkour' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListParkourHeader />
              <Separator />
              {(ratingData as RatingParkourCardProps[]).map((item, idx) => (
                <RatingParkourCard
                  key={idx} idx={idx} area={item.area} gamesplayed={item.gamesplayed} name={item.name} player={item.player} score={item.score}
                />
              ))}
            </div>
          )}
          {currentType === 'belkoin' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListBelkoinHeader />
              <Separator />
              {(ratingData as RatingBelkoinCardProps[]).map((item, idx) => (
                <RatingBelkoinCard key={idx} idx={idx} points={item.points} username={item.username} />
              ))}
            </div>
          )}
          {currentType === 'reputation' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListReputationHeader />
              <Separator />
              {(ratingData as RatingReputationCardProps[]).map((item, idx) => (
                <RatingReputationCard key={idx} idx={idx} reputation={item.reputation} uuid={item.uuid} nickname={item.nickname} />
              ))}
            </div>
          )}
          {currentType === 'charism' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListCharismHeader />
              <Separator />
              {(ratingData as RatingCharismCardProps[]).map((item, idx) => (
                <RatingCharismCard key={idx} idx={idx} Balance={item.Balance} username={item.username} />
              ))}
            </div>
          )}
          {currentType === 'playtime' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListPlaytimeHeader />
              <Separator />
              {(ratingData as RatingPlaytimeCardProps[]).map((item, idx) => (
                <RatingPlaytimeCard key={idx} idx={idx} TotalPlayTime={item.TotalPlayTime} username={item.username} />
              ))}
            </div>
          )}
          {currentType === 'lands_chunks' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListLandsHeader />
              <Separator />
              {(ratingData as RatingLandsCardProps[]).map((item, idx) => (
                <RatingLandsCard
                  type={item.type} blocks={item.blocks} key={idx} idx={idx} chunks_amount={item.chunks_amount}
                  land={item.land} members={item.members} name={item.name}
                />
              ))}
            </div>
          )}
        </>
      )}
      {isLoadingUpdated && <RatingsListSkeleton />}
      {hasMore && <div ref={ref} className="h-[1px] w-full" />}
    </div>
  )
}