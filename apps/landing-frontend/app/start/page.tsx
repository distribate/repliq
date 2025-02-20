import { HowToConnectOnServer } from "@repo/landing-components/src/intro/how-to-connect-on-server";
import { MainLayoutPage } from "@repo/landing-components/src/layout/main-layout";
import { Typography } from "@repo/landing-ui/src/typography";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Начать играть",
  description:
    "Начать играть на Fasberry сервере.",
  keywords: [
    "Fasberry",
    "начать играть на Fasberry сервере",
    "режимы Fasberry",
    "информация о Fasberry сервере",
  ],
  author: "Fasberry Wiki Team",
  robots: "index, follow",
  canonical: "https://fasberry.su/start",
  openGraph: {
    title: "Начать играть",
    description:
      "Начать играть на Fasberry сервере.",
    url: "https://fasberry.su/start",
    type: "website",
    images: [
      {
        url: "https://fasberry.su/images/backgrounds/rules_background.png",
        alt: "Начать играть на Fasberry",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Начать играть",
    description:
      "Начать играть на Fasberry сервере.",
    images: ["https://fasberry.su/images/backgrounds/rules_background.png"],
  },
}

export default async function StartPage() {
  return (
    <MainLayoutPage>
      <div className="flex flex-col items-center w-full gap-12 h-full">
        <Typography className="text-project-color text-2xl lg:text-4xl">
          Как начать играть
        </Typography>
        <div className="flex flex-col gap-6 items-center h-full w-full">
          <div className="flex items-start gap-4 w-full">
            <div className="flex items-center justify-center border-2 aspect-square border-shark-800 h-12 w-12">
              <Typography className="text-black dark:text-white text-xl lg:text-2xl">
                1
              </Typography>
            </div>
            <Typography className="text-black dark:text-white text-xl lg:text-2xl">
              <Link
                href="https://cc.fasberry.su/auth?type=register"
                target="_blank"
                className="text-green text-shadow-lg hover:underline-offset-8 hover:underline"
              >
                Зарегистрироваться
              </Link>&nbsp;на проекте.
              После регистрации убедитесь, что вы успешно вошли на форум и личный кабинет.
            </Typography>
          </div>
        </div>
        <div className="flex flex-col h-full w-full gap-4">
          <div className="flex items-start gap-4 w-full">
            <div className="flex items-center justify-center border-2 aspect-square border-shark-800 h-12 w-12">
              <Typography className="text-black dark:text-white text-2xl">
                2
              </Typography>
            </div>
            <Typography className="text-black dark:text-white text-xl lg:text-2xl">
              Зайдите в любой клиент майнкрафта под ником, который вы указали при регистрации
            </Typography>
          </div>
          <div className="flex h-full lg:h-screen relative w-full">
            <div
              className="absolute w-full h-full lg:h-screen left-0 right-0 top-0 bottom-0"
              style={{ backgroundImage: `url("images/static/dirt.webp")` }}
            />
            <HowToConnectOnServer />
          </div>
        </div>
        <div className="flex items-start gap-4 w-full">
          <div className="flex items-center justify-center border-2 aspect-square border-shark-800 h-12 w-12">
            <Typography className="text-black dark:text-white text-3xl">
              3
            </Typography>
          </div>
          <Typography className="text-black dark:text-white text-xl lg:text-2xl">
            Удачной игры! <span className="text-red">❤</span>
          </Typography>
        </div>
      </div>
    </MainLayoutPage>
  )
}