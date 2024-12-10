'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/ui/accordion';
import { Skeleton } from '#/ui/skeleton';
import { Typography } from '#/ui/typography';
import { NewsImage } from '#/components/news/news-image';
import { newsQuery } from '#/lib/queries/news-query.ts';

const NewsPageItemSkeleton = () => <Skeleton className="h-64 w-full" />;

export const NewsPageList = () => {
  const { data: news, isLoading } = newsQuery({ limit: 12 });
  
  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-4 w-full h-full">
          <NewsPageItemSkeleton />
          <NewsPageItemSkeleton />
          <NewsPageItemSkeleton />
        </div>
      )}
      {(!isLoading && news) && (
        <Accordion
          type="multiple"
          defaultValue={[ news[0].title, news[1].title ]}
          className="flex flex-col gap-4 w-full h-full"
        >
          {news.map((i, idx) => (
            <AccordionItem key={idx} value={i.title} className="border-neutral-600 rounded-[12px] border-2">
              <AccordionTrigger withBook={false} className="p-4">
                <Typography text_color="adaptiveWhiteBlack" className="text-xl">
                  {i.title}
                </Typography>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 px-4">
                <hr className="border border-neutral-800 h-[1px] w-full" />
                {i.images && (
                  <div className="flex flex-wrap items-center overflow-hidden gap-4">
                    {i.images.map(image => (
                      <NewsImage
                        src={image}
                        key={i.id}
                        className="rounded-[8px] w-fit h-fit object-cover max-h-[300px] max-w-[500px] border"
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-col w-full h-full pb-2">
                  <Typography text_color="adaptiveGray" className="text-lg">
                    {i.description}
                  </Typography>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};