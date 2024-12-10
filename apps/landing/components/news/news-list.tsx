'use client';

import { NewsItemWrapper } from '#/components/news/news-item-wrapper';
import Link from 'next/link';
import { Typography } from '#/ui/typography';
import { newsQuery } from '#/lib/queries/news-query.ts';

export const NewsList = () => {
  const { data: news } = newsQuery({ limit: 3 });
  
  if (!news) return null;
  
  return (
    <div className="flex flex-col gap-6">
      {news.map(i => (
        <NewsItemWrapper key={i.id} {...i} />
      ))}
      {news.length >= 3 && (
        <Link href="/news">
          <Typography text_color="adaptiveGray" className="font-bold text-2xl">
            Показать больше
          </Typography>
        </Link>
      )}
    </div>
  );
};