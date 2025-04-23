import { getUser } from "@repo/lib/helpers/get-user";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import Belkoin from "@repo/assets/images/minecraft/belkoin_wallet.png"
import { userBalanceQuery } from "../queries/balance-query";

export const UserBalance = () => {
  const { nickname } = getUser();
  const { data: balance, isLoading } = userBalanceQuery(nickname);

  return (
    <div className="flex flex-col items-start max-w-[200px] overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-center">
          {isLoading ? (
            <Skeleton className="w-4 h-4 rounded-none" />
          ) : (
            <Typography className="text-[15px] font-[Minecraft]">
            {balance?.charism ?? 0}
          </Typography>
          )}
          <img src={Charism} width={16} height={16} alt="" />
        </div>
        <div className="flex gap-1 items-center">
          {isLoading ? (
            <Skeleton className="w-4 h-4 rounded-none" />
          ) : (
            <Typography className="text-[15px] font-[Minecraft]">
            {balance?.belkoin ?? 0}
          </Typography>
          )}
          <img src={Belkoin} width={15} height={15} alt="" />
        </div>
      </div>
    </div>
  )
}