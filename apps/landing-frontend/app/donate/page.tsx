import { WrapperTitle } from '@repo/landing-ui/src/wrapper-title.tsx';
import { Overlay } from '@repo/landing-ui/src/overlay';
import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout.tsx';
import { Typography } from '@repo/landing-ui/src/typography';
import Link from 'next/link';
import { Button } from '@repo/landing-ui/src/button';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { DONATES_QUERY_KEY } from '@repo/lib/queries/donates-query.ts';
import { getDonates } from '@repo/lib/queries/get-donates.ts';
import { Suspense } from 'react';
import { DonateList } from '@repo/landing-components/src/subs/donate-list.tsx';
import { DonateListSkeleton } from '@repo/landing-components/src/skeletons/donate-list-skeleton.tsx';

export const metadata = {
  title: 'Донат',
  description:
    "Поддержите наш сервер Fasberry, приобретая привилегии, уникальные товары и игровые монеты. Улучшите свой игровой опыт и помогите развитию проекта!",
  keywords: [
    "Fasberry донат",
    "купить привилегии Fasberry",
    "игровые товары Fasberry",
    "монеты Fasberry",
    "донат магазин Fasberry",
    "поддержка сервера Fasberry",
  ],
  author: "Fasberry Server Team",
  robots: "index, follow",
  canonical: "https://fasberry.su/donate",
  openGraph: {
    title: "Донат на сервер Fasberry | Уникальные привилегии и товары",
    description:
      "Получите доступ к уникальным привилегиям, товарам и монетам на нашем сервере. Ваша поддержка помогает проекту развиваться!",
    url: "https://fasberry.su/donate",
    type: "website",
    images: [
      {
        url: "https://fasberry.su/images/community/market-seller.webp",
        alt: "Донат на сервер Fasberry",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Донат на сервер Fasberry",
    description:
      "Поддержите наш сервер Fasberry, приобретая уникальные привилегии и товары. Сделайте свой игровой процесс незабываемым!",
    images: ["https://fasberry.su/images/community/market-seller.webp"],
  },
};

const Donates = async () => {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: DONATES_QUERY_KEY,
    queryFn: () => getDonates(),
  });

  const dehydratedState = dehydrate(qc);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DonateList />
    </HydrationBoundary>
  );
};

export default async function DonatePage() {
  return (
    <MainLayoutPage variant="with_section">
      <div
        className="full-screen-section flex items-center justify-start bg-bottom md:bg-center overflow-hidden bg-no-repeat bg-cover
					bg-[url('/images/backgrounds/donate_background.png')]"
      >
        <Overlay variant="default" />
        <WrapperTitle>
          <div className="flex flex-col gap-6 items-start justify-center w-full lg:max-w-3xl">
            <div className="flex flex-col gap-1 w-full lg:max-w-3xl">
              <Typography position="left" className="text-5xl lg:text-6xl text-gold mb-2">
                Покупка привилегий
              </Typography>
              <Typography position="left" text_color="white" className="text-2xl md:text-3xl">
                Здесь можно купить привилегии, ну или узнать о каждой больше.
              </Typography>
            </div>
            <Link href="#donate-list">
              <Button
                size="default"
                variant="pageLink"
                className="hover:bg-[#731c6c] bg-[#8c1c85]"
              >
                <Typography text_color="white" className="font-bold text-xl">
                  <span
                    className="inline-block group-hover:rotate-0 rotate-90 duration-150 group-hover:duration-150"
                  >
                    ⭐
                  </span>
                  &nbsp;К привилегиям
                </Typography>
              </Button>
            </Link>
          </div>
        </WrapperTitle>
      </div>
      <div className="full-screen-section flex flex-col min-h-screen items-center">
        <div
          id="donate-list"
          className="flex flex-col py-32 responsive mx-auto"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            <Typography text_color="black" position="center" variant="block_title">
              Привилегии сервера
            </Typography>
            <Typography size="xl" position="center" className="text-dark-red dark:text-gold">
              привилегии и всё, что с ними связано
            </Typography>
          </div>
          <Suspense fallback={<DonateListSkeleton />}>
            <Donates />
          </Suspense>
        </div>
      </div>
    </MainLayoutPage>
  );
}