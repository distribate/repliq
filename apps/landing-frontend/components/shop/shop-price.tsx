import { Skeleton } from "@repo/landing-ui/src/skeleton"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Wallets } from "./shop-list-wallets"
import { Donates } from "@repo/lib/queries/get-donates"
import { PAYMENT_CURRENCIES_MAPPING } from "@repo/shared/constants/currencies"
import ky from "ky"
import { Typography } from "@repo/landing-ui/src/typography"
import { DONATES_QUERY_KEY } from "./shop-list-donates"
import { shopItemQuery } from "./shop"

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

export const ShopPrice = () => {
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

        price = Math.round(raw * 1000000) / 1000000
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