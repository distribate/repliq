"use client"

import { Tabs, TabsContent } from "@repo/landing-ui/src/tabs"
import { ShopNavigation } from "./shop-navigation"
import { WalletList, WalletsList } from "./shop-list-wallets"
import { EventsList } from "./shop-list-events"
import { DonateList, DonatesList } from "./shop-list-donates"
import { Typography } from "@repo/landing-ui/src/typography"
import { shopItemQuery } from "@repo/lib/queries/shop-item-query"

const ShopItemsList = () => {
  const { data } = shopItemQuery()

  const category = data?.category ?? "donate"

  return (
    <>
      {category === "donate" && <DonatesList />}
      {category === "wallet" && <WalletsList />}
      {category === "events" && null}
    </>
  )
}

export const Shop = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <Tabs
        defaultValue="donate"
        className="flex-col flex gap-8"
      >
        <ShopNavigation />
        <div className="flex flex-col xl:flex-row items-start w-full h-fit gap-4">
          <div className="flex p-2 w-full xl:w-1/4 h-full bg-neutral-300 dark:bg-neutral-900 rounded-lg">
            <div className="flex flex-col gap-4 w-full h-full">
              <div className="flex items-center justify-center min-h-16 w-full rounded-lg px-4 py-3 bg-neutral-400 dark:bg-neutral-50">
                <Typography className="text-neutral-100 dark:text-neutral-950 text-[20px]">
                  Выберите товар
                </Typography>
              </div>
              <ShopItemsList />
            </div>
          </div>
          <div
            className="flex flex-col items-center p-4 w-full xl:w-3/4 h-full bg-neutral-300 dark:bg-neutral-900 rounded-lg 
              *:data-[state=active]:flex *:data-[state=inactive]:hidden"
          >
            <TabsContent value="donate" className="flex flex-col gap-4 w-full h-full">
              <DonateList />
            </TabsContent>
            <TabsContent value="wallet" className="flex flex-col gap-4 w-full h-full">
              <WalletList />
            </TabsContent>
            <TabsContent value="events" className="flex flex-col gap-4 w-full h-full">
              <EventsList />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}