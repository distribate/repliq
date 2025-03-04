import { UserNickname } from "#components/user/name/nickname";
import { getUser } from "@repo/lib/helpers/get-user";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { useQuery } from "@tanstack/react-query";
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import Belkoin from "@repo/assets/images/minecraft/belkoin_wallet.png"

async function getUserBalance(nickname: string) {
  const res = await forumUserClient.user["get-user-balance"][":nickname"].$get({
    param: { nickname }
  });

  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

const userBalanceQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey("user", ["balance"]),
  queryFn: () => getUserBalance(nickname),
  refetchOnWindowFocus: false
})

export const UserBalance = () => {
  const { nickname, name_color } = getUser();
  const { data: balance, isLoading } = userBalanceQuery(nickname);

  return (
    <div className="flex flex-col items-start max-w-[200px] overflow-hidden">
      <div className="flex items-center gap-1">
        <UserNickname className="text-base truncate" nicknameColor={name_color} nickname={nickname} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-center">
          <Typography className="text-[15px] font-[Minecraft]">
            {isLoading ? <Skeleton className="w-4 h-4 rounded-none" /> : balance?.charism}
          </Typography>
          <img src={Charism} width={16} height={16} alt="" />
        </div>
        <div className="flex gap-1 items-center">
          <Typography className="text-[15px] font-[Minecraft]">
            {isLoading ? <Skeleton className="w-4 h-4 rounded-none" /> : balance?.belkoin}
          </Typography>
          <img src={Belkoin} width={15} height={15} alt="" />
        </div>
      </div>
    </div>
  )
}