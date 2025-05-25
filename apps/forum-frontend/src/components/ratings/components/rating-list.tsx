import { Skeleton } from "@repo/ui/src/components/skeleton";
import { RatingBelkoinCard, RatingBelkoinCardProps, RatingCharismCard, RatingCharismCardProps, RatingLandsCard, RatingLandsCardProps, RatingParkourCard, RatingParkourCardProps, RatingPlaytimeCard, RatingPlaytimeCardProps, RatingReputationCard, RatingReputationCardProps } from "./rating-cards";
import { ratingAction, ratingDataAtom, ratingMetaAtom } from "../queries/ratings-query"
import Events from '@repo/assets/gifs/minecraft-boime.gif'
import { Typography } from "@repo/ui/src/components/typography";
import { useInView } from "react-intersection-observer";
import { updateRatingAction } from "#components/ratings/hooks/use-update-ratings.ts";
import { useEffect } from "react";
import { ratingFilterAtom } from "#components/ratings/queries/ratings-filter-query.ts";
import { Separator } from "@repo/ui/src/components/separator";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";

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

const RatingsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <div className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] w-full gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Separator />
      <RatingsListSkeleton />
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

onConnect(ratingDataAtom, (ctx) => ratingAction(ctx, { type: "playtime", ascending: String(false) }))

export const RatingList = reatomComponent(({ ctx }) => {
  const ratingData = ctx.spy(ratingDataAtom)
  const ratingMeta = ctx.spy(ratingMetaAtom)
  const currentType = ctx.spy(ratingFilterAtom).type
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const hasMore = ratingMeta?.hasNextPage;
  const isLoadingUpdated = ctx.spy(updateRatingAction.statusesAtom).isPending;

  useEffect(() => {
    if (inView && hasMore) updateRatingAction(ctx, "update-cursor");
  }, [inView, hasMore]);

  if (ctx.spy(ratingAction.statusesAtom).isPending) return <RatingsSkeleton />

  if (ctx.spy(ratingAction.statusesAtom).isRejected) return <RatingIsEmpty />;

  if (!ratingData) return (
    <ContentNotFound title="Пока ничего нет :/" />
  )

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {isLoadingUpdated && <RatingsSkeleton />}
      {!isLoadingUpdated && (
        <>
          {currentType === 'parkour' && (
            <div className="flex flex-col gap-2 w-full h-full">
              <RatingListParkourHeader />
              <Separator />
              {(ratingData as RatingParkourCardProps[]).map((item, idx) => (
                <RatingParkourCard
                  key={idx}
                  idx={idx}
                  area={item.area}
                  gamesplayed={item.gamesplayed}
                  name={item.name}
                  player={item.player}
                  score={item.score}
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
              {/* @ts-ignore */}
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
}, "RatingList")