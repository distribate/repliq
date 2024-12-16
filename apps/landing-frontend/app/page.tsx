import { MainLayoutPage } from '#/components/layout/main-layout';
import { Overlay } from '#/ui/overlay';
import { Typography } from '#/ui/typography';
import { Block } from '#/ui/block';
import { IntroMain } from '#/components/intro/intro-main';
import { ServerGallery } from '#/components/server-gallery/server-gallery';
import { commuinityGallery } from '#/shared/data/community/community-list';
import { CONTACTS_LIST, ContactsListProps } from '#/shared/data/contacts/contacts-list';
import { GAMEPLAY, GameplayItemType } from '#/shared/data/gameplay/gameplay-list';
import dynamic from 'next/dynamic';
import { CommunityGalleryItem } from '#/components/community/community-gallery-item';
import { NewsList } from '#/components/news/news-list';
import { CommunityStatusItem } from '#/components/community/commuinity-status-item';
import Link from 'next/link';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { NEWS_QUERY_KEY } from '#/lib/queries/news-query.ts';
import { getNews } from '#/lib/queries/get-news.ts';
import { Suspense } from 'react';
import { Skeleton } from '#/ui/skeleton.tsx';

const ReqProvider = dynamic(() =>
  import('#/providers/request-provider').then(m => ({ default: m.ReqProvider })),
);

export const metadata = {
  title: 'Главная | Fasberry',
};

const GameplayItem = ({
  name, image, description, id,
}: GameplayItemType & {
  id: number
}) => {
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
  content, name, href, icon: Icon,
}: ContactsListProps) => {
  return (
    <Block key={name} blockItem rounded="big" size="big" type="column">
      <Typography className="dark:text-neutral-50 text-neutral-800 text-3xl lg:text-4xl xl:text-5xl mb-4">
        {name}
      </Typography>
      <h1 className="text-green text-lg xl:text-3xl">+:</h1>
      {content.pluses && content.pluses.map((plus, plusIndex) => (
        <Typography key={plusIndex} size="lg">
          &gt;&nbsp;{plus}
        </Typography>
      ))}
      <h1 className="mt-2 xl:mt-3 text-rose-500 text-lg xl:text-3xl">-:</h1>
      {content.minuses && content.minuses.map((minus, minusIndex) => (
        <Typography key={minusIndex} size="xl">
          &gt;&nbsp;{minus}
        </Typography>
      ))}
      <Link
        href={href}
        className="flex flex-row items-center gap-x-4 group brightness-110 mt-4 py-4 cursor-pointer group"
      >
        <Icon
          className="fill-white group-hover:fill-[#fabbfb] duration-300 group-hover:duration-300"
          size={32}
        />
        <Typography size="lg">
          Перейти в {name}!
        </Typography>
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
        <ReqProvider />
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
                {commuinityGallery.map((image, idx) =>
                  <CommunityGalleryItem key={idx} image={image} />)
                }
                <Link
                  title="Предложить скрин"
                  href="https://forum.fasberry.su/create-art"
                  target="_blank"
                  className="flex w-full h-full items-center justify-center rounded-[8px] overflow-hidden bg-neutral-800"
                >
                  <div className="flex items-center min-h-[96px] justify-center sm:h-[96px] md:h-[120px] lg:w-[250px] lg:h-[136px]">
                    <Typography className="text-3xl font-bold">+</Typography>
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