'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/ui/accordion';
import { Skeleton } from '#/ui/skeleton';
import { Typography } from '#/ui/typography';
import { newsQuery } from '#/lib/queries/news-query.ts';
import { News } from '#/lib/queries/get-news.ts';

const NewsPageItem = ({
  imageUrl, created_at, description, title, media_links, tags, id,
}: News) => {
  return (
    <AccordionItem
      value={title}
      className="border-neutral-600 rounded-[12px] border-2"
    >
      <AccordionTrigger withBook={false} className="p-4">
        <Typography text_color="adaptiveWhiteBlack" className="text-xl">
          {title}
        </Typography>
      </AccordionTrigger>
      <AccordionContent className="flex items-start overflow-hidden gap-4 p-4">
        <div className="flex flex-col max-h-[400px] gap-1">
          <img
            src={imageUrl}
            alt=""
            width={1920}
            height={1080}
            className="rounded-[8px] w-full h-full object-cover max-w-[500px]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col w-full h-full pb-2">
          <Typography text_color="adaptiveGray" className="text-lg">
            {description}
          </Typography>
        </div>
        {/*{media_links && (*/}
        {/*  <div className="flex items-center gap-2 w-full h-fit">*/}
        {/*    {media_links.map(link => (*/}
        {/*      <Link*/}
        {/*        href="/"*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*)}*/}
      </AccordionContent>
    </AccordionItem>
  );
};

const NewsPageListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-xl">
      Не нашлось новостей :/
    </Typography>
  )
}

export const NewsPageList = () => {
  const { data: news, isLoading, isError } = newsQuery({ limit: 12 });
  
  if (isLoading) return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
  
  if (isError || !news) return <NewsPageListNull/>
  
  return (
    news && (
      <Accordion
        type="multiple"
        defaultValue={[ news[0].title, news[1].title ]}
        className="flex flex-col gap-4 w-full h-full"
      >
        {news.map(newsItem =>
          <NewsPageItem key={newsItem.id} {...newsItem} />,
        )}
      </Accordion>
    )
  );
};