import { getUserBanned } from "@repo/lib/queries/get-user-banned.ts";
import { redirect } from "next/navigation";
import Dirt from "@repo/assets/images/minecraft/dirt.webp";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { BannedActionButton } from "@repo/components/src/buttons/banned-action-button.tsx";
import dayjs from "dayjs";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export default async function BannedPage() {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const isBanned = await getUserBanned(currentUser.nickname);

  if (isBanned?.nickname !== currentUser.nickname) {
    return redirect("/");
  }

  return (
    <div className="flex w-full relative h-screen items-center justify-center">
      <div
        className="absolute w-full h-full brightness-[0.25]"
        style={{
          backgroundImage: `url(${Dirt.src})`,
        }}
      />
      <div className="flex flex-col gap-y-4 items-center relative font-[Minecraft]">
        <Typography
          textSize="medium"
          className="brightness-100 font-semibold text-shark-300"
        >
          Соединение потеряно
        </Typography>
        <div className="flex flex-col items-center gap-y-4">
          <Typography
            textSize="medium"
            className="brightness-100 font-semibold text-red-500"
          >
            Вы были заблокированы на форуме.
          </Typography>
          <div className="flex flex-col items-center">
            <Typography
              textSize="medium"
              className="brightness-100 font-semibold text-red-500"
            >
              Причина: <span className="text-shark-50">{isBanned.reason}</span>
            </Typography>
            <Typography
              textSize="medium"
              className="brightness-100 font-semibold text-red-500"
            >
              Разбан:{" "}
              <span className="text-shark-50">
                {dayjs(isBanned.time).format("DD.MM.YYYY HH:mm")}
              </span>
            </Typography>
          </div>
          <div className="w-full *:w-full">
            <BannedActionButton />
          </div>
        </div>
      </div>
    </div>
  );
}
