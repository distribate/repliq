'use client';

import { Skeleton } from '@repo/landing-ui/src/skeleton';
import { Typography } from '@repo/landing-ui/src/typography';
import { newsQuery } from '@repo/lib/queries/news-query.ts';
import { NewsType } from './news-item-wrapper';
import dayjs from "@repo/lib/constants/dayjs-instance";
import { Dialog, DialogContent, DialogTrigger } from '@repo/landing-ui/src/dialog';
import { NEWS_FILTRATION_QUERY_KEY, NewsFiltrationQuery, newsFiltrationQuery } from './news-page-search';
import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";

const NewsPageItem = ({
  imageUrl, created_at, description, title
}: NewsType["data"][0]) => {
  return (
    <Dialog>
      <DialogTrigger 
        className="flex flex-col group overflow-hidden h-[320px] 
          relative border-2 border-neutral-600 rounded-xl"
      >
        <img
          src={imageUrl}
          alt=""
          width={1920}
          height={1080}
          draggable={false}
          className="rounded-xl relative w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className="flex transition-all rounded-t-xl ease-out group-hover:duration-300 duration-300 
            flex-col absolute bg-gradient-to-t from-black via-black/80 to-transparent
            bottom-0 overflow-hidden p-3 w-full"
        >
          <div
            className="flex flex-col items-start group-hover:-translate-y-0 translate-y-14 transition-all 
              group-hover:duration-300 text-left duration-300 ease-out w-full"
          >
            <Typography className="text-xl text-white" position="left">
              {title.length > 34 ? title.slice(0, 34) + "..." : title}
            </Typography>
            <Typography
              text_color="gray"
              position="left"
              className="transition-all group-hover:opacity-0 group-hover:overflow-hidden group-hover:absolute 
                group-hover:duration-300 duration-300 opacity-100 ease-in text-lg"
            >
              {dayjs(created_at).format('D MMM YYYY')}
            </Typography>
          </div>
          <Typography
            text_color="gray"
            position="left"
            className="group-hover:-translate-y-0 translate-y-24 transition-all 
              group-hover:duration-300 duration-300 ease-out text-lg"
          >
            {description.length > 38 ? description.slice(0, 36) + "..." : description}
          </Typography>
        </div>
      </DialogTrigger>
      <DialogContent className="flex lg:flex-row flex-col items-start gap-4">
        <div className="flex flex-col w-full lg:w-2/3 gap-y-4">
          <div className="flex flex-col">
            <Typography size="xl" className="text-white" position="left">
              {title}
            </Typography>
            <Typography size="lg" text_color="gray" position="left">
              {dayjs(created_at).format('D MMM YYYY')}
            </Typography>
          </div>
          <Typography size="lg" className="text-white" position="left">
            {description}
          </Typography>
        </div>
        <div className="flex w-full lg:w-1/3 lg:h-1/2">
          <img
            src={imageUrl}
            alt=""
            width={1920}
            height={1080}
            draggable={false}
            className="rounded-xl relative w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const NewsPageList = () => {
  const qc = useQueryClient()
  const { data: { searchQuery, limit } } = newsFiltrationQuery()
  const { data, isLoading, isError } = newsQuery({ limit });

  useEffect(() => {
    const meta = data?.meta;

    if (meta) {
      qc.setQueryData(NEWS_FILTRATION_QUERY_KEY, (prev: NewsFiltrationQuery) => ({
        ...prev, hasNextPage: meta?.hasNextPage
      }))
    }
  }, [data?.meta])

  if (isLoading) return (
    <>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </>
  )

  if (isError || !data?.data) return (
    <Typography text_color="adaptiveGray" className="text-xl">
      Не нашлось новостей :/
    </Typography>
  )

  if (!data?.data) return null;

  const news = data.data

  if (!news.length && searchQuery) {
    return (
      <Typography text_color="adaptiveGray" className="text-2xl">
        Не нашлось ничего по вашему запросу <span className="text-white">{`"${searchQuery}"`}</span>
      </Typography>
    )
  }

  return news.map(newsItem => <NewsPageItem key={newsItem.id} {...newsItem} />)
};