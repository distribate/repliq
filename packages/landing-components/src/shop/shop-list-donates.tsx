import { Skeleton } from "@repo/landing-ui/src/skeleton"
import { Typography } from "@repo/landing-ui/src/typography"
import { DONATES_QUERY_KEY, donatesQuery } from "@repo/lib/queries/donates-query"
import { Donates } from "@repo/lib/queries/get-donates"
import { ShopFooter } from "./shop-footer"
import { SHOP_ITEM_QUERY_KEY, ShopItemQuery, shopItemQuery } from "@repo/lib/queries/shop-item-query"
import { useQueryClient } from "@tanstack/react-query";
import LeatherTunic from "@repo/assets/images/minecraft/leather_tunic.webp"
import IronChestplate from "@repo/assets/images/minecraft/iron_chestplate.webp"
import NetheriteChestplate from "@repo/assets/images/minecraft/netherite_chestplate.webp"
import { ShopNickname } from "./shop-list-wallets"

const DonateListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось получить доступные привилегии. Повторите позже
    </Typography>
  )
}

export const donatesMap: Record<"authentic" | "loyal" | "arkhont", { img: string }> = {
  "authentic": {
    img: LeatherTunic.src
  },
  "loyal": {
    img: IronChestplate.src
  },
  "arkhont": {
    img: NetheriteChestplate.src
  }
}

export const DonatesList = () => {
  const qc = useQueryClient()
  const { data, isLoading, isError } = donatesQuery("donate")
  const { data: shopItemState } = shopItemQuery()

  if (isLoading) return (
    <>
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </>
  )

  if (isError) return <DonateListNull />

  if (!data) return <DonateListNull />

  const donates = data as Donates[]
  const selected = shopItemState?.paymentValue

  const changeDonate = (type: "authentic" | "loyal" | "arkhont") => {
    if (type === selected) return;

    const donate = donates.find(w => w.origin === type)

    if (!donate) return;

    qc.setQueryData(SHOP_ITEM_QUERY_KEY, (prev: ShopItemQuery) => ({
      ...prev,
      paymentType: "donate",
      paymentValue: type,
      category: prev.category,
    }))
  }

  return (
    (donates as Donates[]).map(d => (
      <div
        key={d.origin}
        className={`flex items-center w-full min-h-16 gap-4 rounded-lg px-4 py-3 border-2 bg-neutral-800 hover:bg-neutral-700 cursor-pointer
        ${d.origin === selected ? 'border-green' : 'border-transparent'}
      `}
        onClick={() => changeDonate(d.origin as "authentic" | "loyal" | "arkhont")}
      >
        <div className="flex items-center justify-center bg-neutral-600/40 p-2 rounded-lg">
          <img src={donatesMap[d.origin as "authentic" | "loyal" | "arkhont"].img} width={36} height={36} alt="" />
        </div>
        <Typography className="text-[20px]">
          {d.title}
        </Typography>
      </div>
    ))
  )
}

const SelectedDonate = () => {
  const qc = useQueryClient()
  const { data: shopItemState } = shopItemQuery();

  const currentDonates = qc.getQueryData<Donates[]>(DONATES_QUERY_KEY("donate"));

  const selectedDonate = currentDonates
    ? currentDonates.find(cw => cw.origin === shopItemState?.paymentValue)
    : null;

  return (
    selectedDonate ? (
      <>
        <div className="flex flex-col w-full items-center justify-center border-2 border-neutral-600/40 rounded-xl p-4">
          <Typography className="text-lg md:text-xl lg:text-2xl">
            {selectedDonate.title}
          </Typography>
          <Typography className="text-neutral-400 text-center text-sm md:text-base lg:text-lg">
            {selectedDonate.description}
          </Typography>
        </div>
        <div className="flex flex-col w-full gap-4 items-center overflow-auto max-h-[260px] justify-start border-2 border-neutral-600/40 rounded-xl p-4">
          <div className="flex flex-col w-full">
            <Typography className="text-[20px]">
              ⭐ Возможности на сервере:
            </Typography>
            <div className="flex flex-col w-full">
              {selectedDonate.commands.map(sd => (
                <Typography className="text-[16px]">
                  ⏹ {sd}
                </Typography>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full">
            <Typography className="text-[20px]">
              ⭐ Возможности на форуме{selectedDonate.origin !== 'authentic' && <span className="text-neutral-400">: *от аутентика</span>}:
            </Typography>
            {selectedDonate.origin === 'authentic' && (
              <div className="flex flex-col w-full">
                {selectedDonate.forum!.map(sd => (
                  <Typography className="text-[16px]">
                    ⏹ {sd}
                  </Typography>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full h-full border-2 border-neutral-600/40 rounded-xl p-4">
          <ShopNickname />
        </div>
      </>
    ) : (
      <Typography className="text-2xl">
        Донат не выбран
      </Typography>
    )
  )
}

export const DonateList = () => {
  return (
    <>
      <SelectedDonate />
      <ShopFooter />
    </>
  )
}