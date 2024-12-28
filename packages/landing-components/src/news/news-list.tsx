'use client';

import { NewsItemWrapper } from '../news/news-item-wrapper';
import Link from 'next/link';
import { Typography } from '@repo/landing-ui/src/typography';
import { newsQuery } from '@repo/lib/queries/news-query.ts';

export const NewsList = () => {
  const { data: news } = newsQuery({ limit: 3 });

  return (
    <div className="flex flex-col gap-6">
      {!news && (
        <Typography text_color="adaptiveGray" className="text-2xl">
          Новостей пока нет :/
        </Typography>
      )}
      {news && (
        <>
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
        </>
      )}
    </div>
  );
};