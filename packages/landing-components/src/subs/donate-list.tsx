"use client"

import { DONATES_QUERY_KEY, donatesQuery } from '@repo/lib/queries/donates-query.ts';
import { SubscriptionItem } from '../subs/subscription-item.tsx';
import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { DonateListSkeleton } from '../skeletons/donate-list-skeleton.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/landing-ui/src/tabs.tsx';
import EndCrystal from "@repo/assets/images/minecraft/end_crystal.webp"
import Belkoin from "@repo/assets/images/minecraft/belkoin_wallet.png"
import Elytra from "@repo/assets/images/minecraft/elytra.webp"
import { Donates, getDonates } from '@repo/lib/queries/get-donates.ts';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import { useState } from 'react';
import { Slider } from '@repo/landing-ui/src/slider.tsx';
import { Input } from '@repo/landing-ui/src/input.tsx';
import { Button } from '@repo/landing-ui/src/button.tsx';
import ExpActive from "@repo/assets/images/minecraft/exp-active.webp"
import { headerUserQuery } from '#header/header.tsx';
import { Skeleton } from '@repo/landing-ui/src/skeleton.tsx';

const DonateListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось получить доступные привилегии. Повторите позже
    </Typography>
  )
}

const ShopNavigation = () => {
  return (
    <TabsList className="flex lg:flex-row flex-col items-center gap-4 *:duration-300 *:transition-all *:ease-in-out *:p-4">
      <TabsTrigger
        value="donates"
        className="data-[state=active]:bg-gradient-to-r gap-2 
        items-center data-[state=active]:border-[#e28100] 
        data-[state=active]:from-[#e28100] data-[state=active]:via-[#e28100] 
        data-[state=active]:to-[#ffaa00] w-full lg:w-1/5 xl:w-1/6 data-[state=inactive]:border-neutral-500 
        data-[state=inactive]:bg-neutral-800 border-2 rounded-xl"
      >
        <Typography className="text-white text-[20px]">
          Привилегии
        </Typography>
        <img src={Elytra.src} width={28} height={28} alt="" />
      </TabsTrigger>
      <span className="hidden lg:inline text-[20px] text-neutral-300">⏺</span>
      <TabsTrigger
        value="wallet"
        className="data-[state=active]:bg-gradient-to-r gap-2 
        items-center data-[state=active]:border-[#db1ed7] 
        data-[state=active]:from-[#db1ed7] data-[state=active]:via-[#db1ed7] 
        data-[state=active]:to-[#f73ef6] w-full lg:w-1/5 xl:w-1/6 data-[state=inactive]:border-neutral-500 
        data-[state=inactive]:bg-neutral-800 border-2 rounded-xl"
      >
        <Typography className="text-white text-[20px]">
          Валюта
        </Typography>
        <img src={Belkoin.src} width={28} height={28} alt="" />
      </TabsTrigger>
      <span className="hidden lg:inline text-[20px] text-neutral-300">⏺</span>
      <TabsTrigger
        value="events"
        className="data-[state=active]:bg-gradient-to-r gap-2 
        items-center data-[state=active]:border-[#05b458] 
        data-[state=active]:from-[#05b458] data-[state=active]:via-[#05b458] 
        data-[state=active]:to-[#0fd86d] w-full lg:w-1/5 xl:w-1/6 data-[state=inactive]:border-neutral-500 
        data-[state=inactive]:bg-neutral-800 border-2 rounded-xl"
      >
        <Typography className="text-white text-[20px]">
          Ивенты
        </Typography>
        <img src={EndCrystal.src} width={28} height={28} alt="" />
      </TabsTrigger>
    </TabsList>
  )
}

const ShopList = () => {
  return (
    <>
      <TabsContent value="donates" className="flex items-start w-full h-full gap-4">
        <DonateList />
      </TabsContent>
      <TabsContent value="wallet" className="flex items-start w-full h-full gap-4">
        <WalletList />
      </TabsContent>
      <TabsContent value="events" className="flex items-start w-full h-full gap-4">
        <EventsList />
      </TabsContent>
    </>
  )
}

type Events = {
  type: string;
  title: string;
  description: string;
  wallet: string;
  price: number;
}

const EventsList = () => {
  // const { data: events, isLoading } = donatesQuery("events");

  // if (!events) return null;

  return (
    <div className="flex items-start justify-center w-full h-fit gap-4">
      <Typography className="text-3xl">
        Пусто
      </Typography>
      {/* {(events as Events[])?.map(e => (
        <Typography>
          {e.title} {e.price}
        </Typography>
      ))} */}
    </div>
  )
}

type Wallets = {
  type: string;
  value: number;
}

const walletsMap: Record<string, { title: string; img: string; description: string }> = {
  "charism": {
    title: "Харизма",
    description: "Харизма используется при покупке большинства игровых предметов у продавцов или использовании их в аукционе.",
    img: Charism.src
  },
  "belkoin": {
    title: "Белкоин",
    description: "Белкоин используется при покупке уникальных предметов, персонализации или некоторых привилегий.",
    img: Belkoin.src
  },
}

const validateNumber = (input: string): number | null => {
  const num = Number(input);
  return Number.isFinite(num) ? num : null;
};

const WalletList = () => {
  const [isVisible, setIsVisible] = useState(true)
  const { data, isLoading } = donatesQuery("wallet");
  const [selectedWalletValue, setSelectedWalletValue] = useState<number | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<Wallets | null>(null)
  const { data: userFromCookies } = headerUserQuery()
  const [nickname, setNickname] = useState<string | null>(null)

  const wallets = data as Wallets[]

  const changeWallet = (type: "charism" | "belkoin") => {
    if (type === selectedWallet?.type) return;

    const wallet = wallets.find(w => w.type === type)

    if (!wallet) {
      return;
    }

    setSelectedWallet(wallet)
    setSelectedWalletValue(0)
  }

  return (
    <div className="flex flex-col xl:flex-row items-start w-full h-fit gap-4">
      <div className="flex p-2 w-full xl:w-1/4 h-full bg-neutral-900 rounded-lg">
        <div className="flex flex-col gap-4 w-full h-full">
          <div className="flex items-center justify-center min-h-16 w-full rounded-lg px-4 py-3 bg-neutral-50">
            <Typography className="text-neutral-950 text-[20px]">
              Выберите валюту
            </Typography>
          </div>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </>
          ) : (
            wallets?.map(w => (
              <div
                className={`flex items-center w-full min-h-16 gap-4 rounded-lg px-4 py-3 border-2 bg-neutral-800 hover:bg-neutral-700 cursor-pointer
                  ${w.type === selectedWallet?.type ? 'border-green' : 'border-transparent'}`}
                onClick={() => changeWallet(w.type as "charism" | "belkoin")}
              >
                <div className="flex items-center justify-center bg-neutral-600/40 p-2 rounded-lg">
                  <img src={walletsMap[w.type].img} width={36} height={36} alt="" />
                </div>
                <Typography className="text-[20px]">
                  {walletsMap[w.type].title}
                </Typography>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 p-4 w-full xl:w-3/4 h-full bg-neutral-900 rounded-lg">
        {selectedWallet ? (
          <>
            <div className="flex flex-col w-full items-center justify-center border-2 border-neutral-600/40 rounded-xl p-4">
              <Typography className="text-lg md:text-xl lg:text-2xl">
                {walletsMap[selectedWallet.type].title}
              </Typography>
              <Typography className="text-neutral-400 text-center text-sm md:text-base lg:text-lg">
                {walletsMap[selectedWallet.type].description}
              </Typography>
            </div>
            <div className="flex flex-col gap-4 w-full h-full border-2 border-neutral-600/40 rounded-xl p-4">
              <div className="flex flex-col gap-2">
                <Typography className="text-[18px]">
                  Укажите никнейм
                </Typography>
                <div className="flex flex-col lg:flex-row items-center gap-2 w-full">
                  <Input
                    type="text"
                    maxLength={32}
                    className="px-4 w-full lg:w-1/3"
                    placeholder="Введите никнейм"
                    value={nickname ?? ""}
                    onChange={e => {
                      setNickname(e.target.value)
                    }}
                  />
                  {(isVisible && userFromCookies) && (
                    <div className="flex items-center min-h-10 lg:min-h-14 w-full lg:w-fit bg-neutral-700 px-4 py-1 h-full rounded-lg gap-4">
                      <Typography>
                        Ваш ник {userFromCookies}?
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-green rounded-md py-1"
                          onClick={() => {
                            setIsVisible(false)
                            setNickname(userFromCookies)
                          }}
                        >
                          <Typography className="text-neutral-950 text-[14px]">
                            Да
                          </Typography>
                        </Button>
                        <Button
                          onClick={() => setIsVisible(false)}
                          className="bg-red rounded-md py-1"
                        >
                          <Typography className="text-neutral-950 text-[14px]">
                            Нет
                          </Typography>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Typography className="text-[18px]">
                  Укажите количество
                </Typography>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    maxLength={8}
                    className="px-4 w-full lg:w-1/3"
                    placeholder="Введите сумму"
                    value={selectedWalletValue ?? ""}
                    onChange={e => {
                      const value = validateNumber(e.target.value);

                      if (value !== null) {
                        setSelectedWalletValue(value)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Typography className="text-[14px] text-neutral-400">
                  *Текущий курс: 1&nbsp;
                </Typography>
                <img src={walletsMap[selectedWallet.type].img} width={16} height={16} alt="" />
                <Typography className="text-[14px] text-neutral-400">
                  &nbsp;= {selectedWallet.value} RUB
                </Typography>
              </div>
            </div>
            <div
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 
                w-full h-full border-2 border-neutral-600/40 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 justify-center w-fit rounded-lg">
                <div className="flex items-center justify-center bg-neutral-600/40 p-2 rounded-lg">
                  <img src={ExpActive.src} width={36} height={36} alt="" />
                </div>
                <div className="flex flex-col">
                  <Typography className="text-[16px] text-neutral-400">
                    Стоимость
                  </Typography>
                  <Typography className="text-[18px]">
                    {(selectedWalletValue ?? 0) * selectedWallet.value} RUB
                  </Typography>
                </div>
              </div>
              <Button
                disabled={(nickname?.length === 0) || (selectedWalletValue === null || selectedWalletValue === 0)}
                className="bg-neutral-800 rounded-lg px-6 py-4 hover:bg-neutral-700"
              >
                <Typography className="text-[20px]">
                  Приобрести
                </Typography>
              </Button>
            </div>
          </>
        ) : (
          <Typography className="text-2xl">
            Валюта не выбрана
          </Typography>
        )}
      </div>
    </div>
  )
}

export const Shop = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <Tabs defaultValue="donates" className="flex-col flex gap-8">
        <ShopNavigation />
        <ShopList />
      </Tabs>
    </div>
  )
}

export const DonateList = () => {
  const { data: donates, isLoading, isError } = donatesQuery("donate")

  if (isLoading) return <DonateListSkeleton />
  if (isError) return <DonateListNull />

  if (!donates) return <DonateListNull />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      {(donates as Donates[]).map(d => <SubscriptionItem key={d.origin} {...d} />)}
    </div>
  )
}