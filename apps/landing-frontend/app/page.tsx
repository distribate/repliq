import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout';
import { Overlay } from '@repo/landing-ui/src/overlay';
import { Typography } from '@repo/landing-ui/src/typography';
import { Block } from '@repo/landing-ui/src/block';
import { IntroMain } from '@repo/landing-components/src/intro/intro-main';
import { CONTACTS_LIST, ContactsListProps } from '@repo/shared/wiki/data/contacts/contacts-list';
import { GAMEPLAY, GameplayItemType } from '@repo/shared/wiki/data/gameplay/gameplay-list';
import { CommunityGalleryItem } from '@repo/landing-components/src/community/community-gallery-item';
import { NewsList } from '@repo/landing-components/src/news/news-list';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@repo/landing-ui/src/skeleton.tsx';
import dynamic from 'next/dynamic';
import { IntroBackgroundImage } from "@repo/landing-components/src/intro/background-image";
import { StatusItem } from "@repo/landing-components/src/intro/status-item";

const ParamProvider = dynamic(() => import("@repo/landing-components/src/layout/param-provider")
  .then(m => m.ParamProvider), {
  ssr: false
})

export const metadata = {
  title: 'Главная - Fasberry',
  description:
    "Добро пожаловать на Fasberry! Уникальные сервера, захватывающие события и дружелюбное сообщество. Играй с друзьями и создавай свой мир прямо сейчас!",
  keywords: [
    "Fasberry сервер",
    "лучший Minecraft сервер",
    "играть в Fasberry онлайн",
    "Minecraft режимы",
    "Minecraft события",
    "fasberry",
    "fasberry minecraft",
    "minecraft fasberry сервер",
    "Fasberry server",
    "Fasberry project",
    "дружелюбное сообщество Fasberry",
  ],
  author: "Fasberry Server Team",
  robots: "index, follow",
  canonical: "https://fasberry.su/",
  openGraph: {
    title: "Fasberry Сервер | Создай свой уникальный мир",
    description:
      "На нашем Fasberry-сервере ты найдешь всё: креативные режимы, мини-игры, уникальные квесты и теплую атмосферу. Присоединяйся прямо сейчас!",
    url: "https://fasberry.su/",
    type: "website",
    images: [
      {
        url: "https://fasberry.su/images/backgrounds/donate_background.png",
        alt: "Fasberry сервер - лучший выбор",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fasberry Сервер | Присоединяйся к лучшим",
    description:
      "Стань частью нашего Minecraft-сервера. Уникальные миры, незабываемые приключения и дружелюбные игроки ждут тебя!",
    images: ["https://fasberry.su/images/backgrounds/donate_background.png"],
  },
};

type GamePlayItemProps = GameplayItemType & {
  id: number
}

const GameplayItem = ({
  name, image, description, id,
}: GamePlayItemProps) => {
  return (
    <div
      className={`flex flex-col w-full items-center justify-end h-[80vh] lg:h-screen relative bg-top
			 lg:bg-center border-0 border-discord-server-color ${GAMEPLAY.length - 2 === id && 'lg:border-l-2 lg:border-r-2'}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <Overlay />
      <div
        className="flex flex-col items-center justify-center relative w-full gap-y-2 py-16 z-[2] px-6 bg-black/60"
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
    <Block key={name} blockItem rounded="big" type="column" className="justify-between p-4 lg:p-6">
      <div className="flex flex-col mb-4">
        <Typography className="dark:text-neutral-50 text-neutral-800 text-3xl lg:text-4xl xl:text-5xl mb-4">
          {name}
        </Typography>
        <h1 className="text-[#5CC85C] text-lg xl:text-3xl">плюсы:</h1>
        {content.pluses && content.pluses.map((plus, plusIndex) => (
          <Typography key={plusIndex} className="text-[14px] lg:text-lg">
            &gt;&nbsp;{plus}
          </Typography>
        ))}
        <h1 className="mt-2 xl:mt-3 text-rose-500 text-lg xl:text-3xl">минусы:</h1>
        {content.minuses && content.minuses.map((minus, minusIndex) => (
          <Typography key={minusIndex} className="text-[14px] lg:text-lg">
            &gt;&nbsp;{minus}
          </Typography>
        ))}
      </div>
      <div className="flex w-full items-center justify-center lg:justify-start">
        <Link
          href={href}
          target="_blank"
          className="flex w-fit gap-4 *:ease-in-out *:duration-300 *:group-hover:duration-300 *:transition-all rounded-xl px-8 items-center gap-x-4 group
          border-2 hover:border-white/80 border-white/60 py-4"
        >
          <Typography size="lg" className="text-black/60 group-hover:text-black/80 dark:text-white/60 dark:group-hover:text-white/80">
            Перейти в {name}
          </Typography>
          <span
            className="text-[18px] text-black/60 group-hover:text-black/80 dark:text-white/60 dark:group-hover:text-white/80"
          >
            {`>`}
          </span>
        </Link>
      </div>
    </Block>
  );
};

export default async function Main() {
  return (
    <MainLayoutPage variant="with_section">
      <ParamProvider />
      <div
        id="title"
        className={`flex flex-col relative items-start full-screen-section h-[80vh] lg:h-screen justify-center`}
      >
        <div className="absolute top-0 right-0 left-0 overflow-hidden h-full">
          <IntroBackgroundImage />
          <Overlay variant="default" />
        </div>
        <div className="flex items-center responsive z-1 mx-auto h-full">
          <IntroMain />
        </div>
      </div>
      <div
        id="gameplay-overview"
        className="full-screen-section relative min-h-screen flex flex-col items-center"
      >
        <div className="grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1">
          {GAMEPLAY.map((item, idx) =>
            <GameplayItem key={item.name} id={idx} {...item} />)
          }
        </div>
      </div>
      <div className="full-screen-section relative min-h-screen">
        <div className="flex xl:flex-row flex-col py-24 mx-auto gap-y-12 xl:gap-y-6 group gap-x-6 responsive">
          <div
            id="project-news"
            className="flex flex-col gap-y-6 w-full xl:w-3/5"
          >
            <Typography text_color="black" className="text-2xl sm:text-3xl lg:text-4xl">
              Новости
            </Typography>
            <NewsList />
          </div>
          <div
            id="commuinity"
            className="flex flex-col gap-y-6 w-full xl:w-2/5"
          >
            <Typography text_color="black" className="text-2xl sm:text-3xl lg:text-4xl">
              Cообщество
            </Typography>
            <StatusItem />
            <div
              className="flex flex-col bg-background-light p-4 rounded-xl dark:bg-background-dark h-fit gap-y-4 border-2 border-neutral-600"
            >
              <Typography text_color="adaptiveWhiteBlack" className="text-xl lg:text-2xl">
                Скриншоты от игроков
              </Typography>
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2">
                <CommunityGalleryItem />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="contacts"
        className="full-screen-section min-h-screen relative flex flex-col items-center justify-center py-32 xl:py-0"
      >
        <div className="flex flex-col gap-y-12 responsive">
          <h2 className="text-2xl sm:text-3xl md:text-6xl lg:text-6xl xl:text-7xl text-center text-red">
            Где ещё существует проект?
          </h2>
          <div className="flex flex-col lg:flex-row gap-x-4 gap-y-6 justify-between">
            {CONTACTS_LIST.map(contact =>
              <ContactItem key={contact.name} {...contact} />)
            }
          </div>
        </div>
      </div>
      {/* <ServerGallery /> */}
    </MainLayoutPage>
  );
}