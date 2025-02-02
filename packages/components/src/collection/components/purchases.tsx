import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"
import FancyFeather from "@repo/assets/images/minecraft/fancy_feather.webp"
import { Typography } from "@repo/ui/src/components/typography"

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
  const { data } = purchasesQuery()

  if (!data) return null;

  return (
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
}