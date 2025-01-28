import { landsClient } from "@repo/shared/api/minecraft-client"
import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"
import { Link } from "@tanstack/react-router"
import { InferResponseType } from "hono/client"
import Looking from '@repo/assets/images/looking.jpg'
import BottleEnchating from "@repo/assets/images/minecraft/bottle_enchanting.webp"
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import SteveHead from "@repo/assets/images/minecraft/steve_head.jpg"
import { LAND_URL } from "@repo/shared/constants/routes"

const client = landsClient.lands['get-lands'].$get

type LandCard = InferResponseType<typeof client, 200>["data"][0]

export const LandCard = ({ balance, created_at, level, members, name, title, ulid }: LandCard) => {
  return (
    <div className="relative w-full bg-shark-950 border-b border-shark-800 rounded-lg p-4">
      <div className="flex items-center gap-4 overflow-hidden rounded-md">
        <img
          src={Looking}
          alt=""
          width={100}
          draggable={false}
          height={100}
          className="rounded-md"
        />
        <div className="flex flex-col gap-y-2">
          <Typography className="text-[20px] font-[Minecraft]">
            {name} {title ? `(${title})` : ''}
          </Typography>
          <div className="flex select-none items-center gap-4">
            <div className="flex items-center gap-1">
              <img src={BottleEnchating} draggable={false} alt="lvl" width={16} height={16} />
              <Typography className="text-[16px] font-[Minecraft]">
                {level}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <img src={Charism} draggable={false} alt="charism" width={16} height={16} />
              <Typography className="text-[16px] font-[Minecraft]">
                {balance}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <img src={SteveHead} draggable={false} alt="members" width={16} height={16} />
              <Typography className="text-[16px] font-[Minecraft]">
                {Object.keys(members).length}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={LAND_URL + ulid}>
              <Button state="default">
                <Typography className="text-[16px] font-[Minecraft]">
                  Перейти
                </Typography>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}