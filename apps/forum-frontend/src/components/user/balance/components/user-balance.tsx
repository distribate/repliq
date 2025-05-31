import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import Belkoin from "@repo/assets/images/minecraft/belkoin_wallet.png"
import { userBalanceAction, userBalanceAtom } from "../models/balance.model";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";

onConnect(userBalanceAction, userBalanceAction)

export const UserBalance = reatomComponent(({ ctx }) => {
  const balance = ctx.spy(userBalanceAtom)
  const isLoading = ctx.spy(userBalanceAction.statusesAtom).isPending

  return (
    <div className="flex flex-col items-start max-w-[200px] overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-center">
          {isLoading ? (
            <Skeleton className="w-4 h-4 rounded-none" />
          ) : (
            <Typography className="text-[15px]">
            {balance?.charism ?? 0}
          </Typography>
          )}
          <img src={Charism} width={16} height={16} alt="" />
        </div>
        <div className="flex gap-1 items-center">
          {isLoading ? (
            <Skeleton className="w-4 h-4 rounded-none" />
          ) : (
            <Typography className="text-[15px]">
            {balance?.belkoin ?? 0}
          </Typography>
          )}
          <img src={Belkoin} width={15} height={15} alt="" />
        </div>
      </div>
    </div>
  )
}, "UserBalance")