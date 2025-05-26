import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import Minecart from "@repo/assets/images/minecraft/minecart_chest.webp"
import { getUser } from "@repo/lib/helpers/get-user";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { reatomComponent } from "@reatom/npm-react";

export const ProfileAccountReferals = reatomComponent(({ ctx }) => {
  const nickname = getUser(ctx).nickname
  const navigate = useNavigate()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`https://hub.fasberry.su/auth?type=register&from=${nickname}`);
    toast.success("Ссылка скопирована")
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-1 w-fit">
            <Typography textColor="shark_white" textSize="big"  className="font-semibold">
              Реферальная система
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-auto gap-4 w-full h-full">
          <div className="flex flex-col gap-4 items-start p-4 w-fit bg-shark-950 rounded-lg">
            <div className="flex items-center gap-4">
              <Typography className="text-[18px] font-medium">
                Пригласи друга на сервер и получи приятный бонус к игре!&nbsp;
                <a href="https://fasberry.su/wiki?tab=referals" target="_blank" rel="noreferrer" className="w-fit text-shark-300">
                  (подробнее)
                </a>
              </Typography>
              <img src={Minecart} alt="" width={36} height={36} />
            </div>
            <div className="flex items-center w-full gap-4">
              <Button variant="positive" className="w-2/3" onClick={copyToClipboard}>
                <Typography textSize="medium">
                  Получить ссылку
                </Typography>
              </Button>
              <Button
                onClick={() => navigate({ to: "/collection", search: { type: "referals" } })}
                state="default"
                className="w-1/3"
              >
                <Typography textSize="medium">
                  К рефералам
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}, "ProfileAccountReferals")