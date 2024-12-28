import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout';
import { Overlay } from '@repo/landing-ui/src/overlay';
import { Typography } from '@repo/landing-ui/src/typography';
import { Block } from '@repo/landing-ui/src/block';
import { IntroMain } from '@repo/landing-components/src/intro/intro-main';
import { ServerGallery } from '@repo/landing-components/src/server-gallery/server-gallery';
import { CONTACTS_LIST, ContactsListProps } from '@repo/shared/wiki/data/contacts/contacts-list';
import { GAMEPLAY, GameplayItemType } from '@repo/shared/wiki/data/gameplay/gameplay-list';
import dynamic from 'next/dynamic';
import { CommunityGalleryItem } from '@repo/landing-components/src/community/community-gallery-item';
import { NewsList } from '@repo/landing-components/src/news/news-list';
import { CommunityStatusItem } from '@repo/landing-components/src/community/commuinity-status-item';
import Link from 'next/link';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { NEWS_QUERY_KEY } from '@repo/lib/queries/news-query.ts';
import { getNews } from '@repo/lib/queries/get-news.ts';
import { Suspense } from 'react';
import { Skeleton } from '@repo/landing-ui/src/skeleton.tsx';

export const metadata = {
  title: 'Главная | Fasberry',
};

type GamePlayItemProps = GameplayItemType & {
  id: number
}

const GameplayItem = ({
  name, image, description, id,
}: GamePlayItemProps) => {
  return (
    <div
      className={`flex flex-col w-full items-center justify-end min-h-screen relative bg-top
			 lg:bg-center border-0 border-discord-server-color ${GAMEPLAY.length - 2 === id && 'lg:border-l-2 lg:border-r-2'}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <Overlay />
      <div
        className="flex flex-col items-center justify-center relative w-full gap-y-2 py-16 px-6 bg-black/60"
      >
        <h1 className="text-2xl md:text-3xl 2xl:text-5xl text-red text-center">
          {name}
        </h1>
        <Typography position="center" className="text-white text-xl md:text-2xl 2xl:text-3xl">
          {description}
        </Typography>
      </div>
      <div className="borders_up xl:hidden" />
      <div className="borders_down xl:hidden" />
    </div>
  );
};

const ContactItem = ({
  content, name, href
}: ContactsListProps) => {
  return (
    <Block key={name} blockItem rounded="big" size="big" type="column" className="justify-between">
      <div className="flex flex-col">
        <Typography className="dark:text-neutral-50 text-neutral-800 text-3xl lg:text-4xl xl:text-5xl mb-4">
          {name}
        </Typography>
        <h1 className="text-[#5CC85C] text-lg xl:text-3xl">плюсы:</h1>
        {content.pluses && content.pluses.map((plus, plusIndex) => (
          <Typography key={plusIndex} size="lg">
            &gt;&nbsp;{plus}
          </Typography>
        ))}
        <h1 className="mt-2 xl:mt-3 text-rose-500 text-lg xl:text-3xl">минусы:</h1>
        {content.minuses && content.minuses.map((minus, minusIndex) => (
          <Typography key={minusIndex} size="xl">
            &gt;&nbsp;{minus}
          </Typography>
        ))}
      </div>
      <Link
        href={href}
        className="flex w-fit bg-neutral-200/60 dark:bg-neutral-600/60 rounded-[6px]
        px-4 items-center gap-x-4 group brightness-110 mt-4 py-4 cursor-pointer group"
      >
        <Typography size="lg" text_color="adaptiveWhiteBlack">
          Перейти в {name}!
        </Typography>
        <span
          className="text-[18px] group-hover:translate-x-0
          -translate-x-2 ease-in-out duration-200 group-hover:duration-200 transition"
        >
          {`>`}
        </span>
      </Link>
    </Block>
  );
};

const News = async() => {
  const qc = new QueryClient();
  
  await qc.prefetchQuery({
    queryKey: NEWS_QUERY_KEY,
    queryFn: () => getNews({ limit: 3 }),
  });
  
  const dehydratedState = dehydrate(qc);
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <NewsList />
    </HydrationBoundary>
  );
};

export default async function Main() {
  return (
    <MainLayoutPage variant="with_section">
      <div
        id="title"
        className="full-screen-section flex flex-col items-start justify-center"
      >
        <div className="absolute top-0 right-0 left-0 overflow-hidden h-screen">
          <div
            className="w-full h-full absolute top-0 right-0 left-0 bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url("/images/backgrounds/main_background.png")` }}
          />
          <Overlay variant="default" />
        </div>
        <div className="responsive mx-auto">
          <IntroMain />
        </div>
      </div>
      <div
        id="gameplay-overview"
        className="full-screen-section flex flex-col items-center"
      >
        <div className="grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1">
          {GAMEPLAY.map((item, idx) =>
            <GameplayItem key={item.name} id={idx} {...item} />)
          }
        </div>
      </div>
      <div className="full-screen-section">
        <div className="flex xl:flex-row flex-col py-24 mx-auto gap-y-12 xl:gap-y-6 group gap-x-6 responsive">
          <div
            id="project-news"
            className="flex flex-col gap-y-6 w-full xl:w-3/5"
          >
            <Typography text_color="black" className="text-3xl lg:text-4xl">
              Новости
            </Typography>
            <Suspense fallback={
              <>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </>
            }>
              <News />
            </Suspense>
          </div>
          <div
            id="commuinity"
            className="flex flex-col gap-y-6 w-full xl:w-2/5"
          >
            <Typography text_color="black" className="text-3xl lg:text-4xl">
              Cообщество
            </Typography>
            <CommunityStatusItem />
            <Block blockItem type="column" size="normal" rounded="big" className="h-max gap-y-8">
              <Typography className="text-xl lg:text-2xl">
                Скриншоты от игроков
              </Typography>
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2">
                <CommunityGalleryItem />
                <Link
                  title="Предложить скрин"
                  href="https://forum.fasberry.su/create-art"
                  target="_blank"
                  className="flex w-full h-full items-center justify-center rounded-[8px] overflow-hidden bg-neutral-800"
                >
                  <div className="flex items-center min-h-[96px] justify-center sm:h-[96px] md:h-[120px] lg:w-[250px] lg:h-[136px]">
                    <Typography className="text-3xl font-bold">
                      +
                    </Typography>
                  </div>
                </Link>
              </div>
            </Block>
          </div>
        </div>
      </div>
      <div
        id="contacts"
        className="full-screen-section flex flex-col items-center justify-center py-32 xl:py-0"
      >
        <div className="flex flex-col gap-y-12 responsive mx-auto">
          <h2 className="text-3xl md:text-6xl lg:text-6xl xl:text-7xl text-center text-red">
            Где ещё существует проект?
          </h2>
          <div className="flex flex-col lg:flex-row gap-x-4 gap-y-6 justify-between">
            {CONTACTS_LIST.map(contact =>
              <ContactItem key={contact.name} {...contact} />)
            }
          </div>
        </div>
      </div>
      <ServerGallery />
    </MainLayoutPage>
  );
}