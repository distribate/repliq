import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"
import FancyFeather from "@repo/assets/images/minecraft/fancy_feather.webp"
import { Typography } from "@repo/ui/src/components/typography"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Star } from "lucide-react"
import dayjs from "@repo/lib/constants/dayjs-instance"

async function getPurchases() {
  const res = await forumUserClient.user["get-user-purchases"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

const purchasesQuery = () => useQuery({
  queryKey: createQueryKey("user", ["purchases"]),
  queryFn: getPurchases,
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

export const Purchases = () => {
  const { data, isLoading, isError } = purchasesQuery()

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </>
    )
  }

  if (!data || !data.length || isError) return (
    <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
      <img src={FancyFeather} alt="" width={96} height={96} />
      <Typography
        textColor="shark_white"
        textSize="very_big"
        className="font-semibold"
      >
        У вас нет покупок
      </Typography>
    </div>
  )

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full auto-rows-auto">
      {data.map(payment => (
        <div
          key={payment.id}
          className="flex items-center justify-between w-full group bg-shark-950 px-4 py-6 rounded-lg"
        >
          <div className="flex flex-col lg:flex-row items-center gap-4 w-3/4">
            <div className="flex items-center justify-center bg-shark-700 rounded-md p-2">
              {payment.imageUrl ? (
                <img draggable={false} src={payment.imageUrl} width={48} height={48} alt="" />
              ) : (
                <Star
                  size={48}
                  className="text-gold-300 group-hover:duration-300 duration-300 ease-in-out transition-all group-hover:fill-gold-300"
                />
              )}
            </div>
            <div className='flex flex-col'>
              <Typography className="font-semibold" textSize="large">
                {payment.title}
              </Typography>
              <Typography textSize="medium" textColor="gray">
                Дата: {dayjs(payment.created_at).format("DD.MM.YYYY")}
              </Typography>
            </div>
          </div>
          <div className="flex justify-end items-center w-1/4">
            <Typography className="font-semibold" textSize="big">
              - {Number(payment.price).toFixed(2)} {payment.currency}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  )
}