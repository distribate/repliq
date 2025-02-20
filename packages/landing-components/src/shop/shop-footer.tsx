import { StartPayment, usePayment } from "#subs/subscription-item.tsx";
import { shopItemQuery } from "@repo/lib/queries/shop-item-query";
import { useState } from "react";
import { ShopSelectCurrency } from "./shop-select-currency";
import { Dialog } from "@repo/landing-ui/src/dialog";
import { Button } from "@repo/landing-ui/src/button";
import { Typography } from "@repo/landing-ui/src/typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallets } from "./shop-list-wallets";
import ExpActive from "@repo/assets/images/minecraft/exp-active.webp"
import { DONATES_QUERY_KEY } from "@repo/lib/queries/donates-query";
import { Donates } from "@repo/lib/queries/get-donates";
import { PAYMENT_CURRENCIES_MAPPING } from '@repo/shared/constants/currencies.ts';
import ky from "ky";
import { Skeleton } from "@repo/landing-ui/src/skeleton";

type CurrencyString = typeof PAYMENT_CURRENCIES_MAPPING[keyof typeof PAYMENT_CURRENCIES_MAPPING];

export async function getCurrencyPriceInRub<T extends CurrencyString>(convertedCurrency: T): Promise<{
  [key in T]: { rub: number }
}> {
  // @ts-ignore
  const currencyId = PAYMENT_CURRENCIES_MAPPING[convertedCurrency]

  try {
    return await ky.get("https://api.coingecko.com/api/v3/simple/price", {
      searchParams: {
        "ids": currencyId,
        "vs_currencies": "rub"
      }
    }).json<{ [key in T]: { rub: number } }>();
  } catch (e) {
    // @ts-ignore
    throw new Error(e)
  }
}

export const PRICE_BY_CURRENCY_QUERY_KEY = (currency: string) => ["price", "by", currency]

const priceByCurrencyQuery = (currency: string) => useQuery({
  queryKey: PRICE_BY_CURRENCY_QUERY_KEY(currency),
  queryFn: async () => {
    const res = await getCurrencyPriceInRub(currency)

    if (Object.keys(res).length === 0) return null;

    return res
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled: currency !== "RUB",
  retry: 2
})

export const FinishedPrice = () => {
  const qc = useQueryClient()
  const { data: shopItemState } = shopItemQuery()
  const { data: priceByCurrency, isLoading, isError } = priceByCurrencyQuery(shopItemState.currency)

  if (isLoading) {
    return <Skeleton className="h-6 w-34" />
  }

  const getFinishedPrice = (value: number = 0): number => {
    if (!shopItemState || !shopItemState?.paymentType) return 0

    const paymentType = shopItemState.paymentType

    let price: number | null = null;

    switch (paymentType) {
      case "belkoin":
      case "charism":
        const currentWallets = qc.getQueryData<Wallets[]>(DONATES_QUERY_KEY("wallet"));
        const selectedWallet = currentWallets
          ? currentWallets.find(cw => cw.type === shopItemState.paymentType)
          : null;

        if (!selectedWallet) return 0;

        price = value * selectedWallet.value
        break;
      case "donate":
        const currentDonates = qc.getQueryData<Donates[]>(DONATES_QUERY_KEY("donate"));

        const selectedDonate = currentDonates
          ? currentDonates.find(cd => cd.origin === shopItemState.paymentValue)
          : null;

        if (!selectedDonate) return 0;

        price = Number(selectedDonate.price);
        break;
    }

    if (shopItemState.currency !== "RUB" && priceByCurrency) {
      const currencyId = PAYMENT_CURRENCIES_MAPPING[shopItemState.currency]

      if (priceByCurrency) {
        const raw = (price ?? 0) / priceByCurrency[currencyId].rub

        price = Math.round(raw * 100) / 100
      } else {
        price = 0
      }
    }

    return price ?? 0;
  }

  const finishedPrice = getFinishedPrice(Number(shopItemState?.paymentValue ?? 0))

  const currency = shopItemState?.currency ?? "RUB"

  return (
    <Typography className="text-[18px]">
      {isError ? "Ошибка" : `${finishedPrice} ${currency}`}
    </Typography>
  )
}

export const ShopFooter = () => {
  const [open, setOpen] = useState(false)
  const { data: shopItemState } = shopItemQuery()
  const { updatePaymentDetailsMutation } = usePayment();

  const nickname = shopItemState?.nickname;

  const startPayment = () => {
    if (!nickname || !shopItemState) return;

    updatePaymentDetailsMutation.mutate({
      nickname,
      paymentType: shopItemState.paymentType,
      paymentValue: shopItemState.paymentValue
    })

    setOpen(true)
  }

  const isValid = shopItemState
    ? !!nickname && !!shopItemState.paymentType && !!shopItemState.paymentValue
    : false

  return (
    <>
      <div className="flex flex-col gap-4 w-full h-full border-2 border-neutral-600/40 rounded-xl p-4">
        <ShopSelectCurrency />
      </div>
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between
            gap-4 w-full h-full border-2 border-neutral-600/40 rounded-xl p-4"
      >
        <div className="flex items-center gap-2 justify-center w-fit rounded-lg">
          <div className="flex items-center justify-center bg-neutral-600/40 p-2 rounded-lg">
            <img src={ExpActive.src} width={36} height={36} alt="" />
          </div>
          <div className="flex flex-col">
            <Typography className="text-[16px] text-neutral-400">
              Стоимость
            </Typography>
            <FinishedPrice />
          </div>
        </div>
        <div className="flex items-center w-fit">
          <Dialog open={open} onOpenChange={setOpen}>
            <Button
              onClick={startPayment}
              disabled={!isValid}
              className="group hover:bg-[#05b458] transition-all duration-300
                  ease-in-out bg-[#088d47] rounded-lg px-6 py-4 "
            >
              <Typography className="text-[20px]">
                Приобрести
              </Typography>
            </Button>
            <StartPayment />
          </Dialog>
        </div>
      </div>
    </>
  )
}