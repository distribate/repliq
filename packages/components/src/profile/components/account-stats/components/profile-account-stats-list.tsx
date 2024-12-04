import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";

type ProfileAccountStatsProps = Pick<UserEntity, "nickname">;

export const ProfileAccountStats = ({ nickname }: ProfileAccountStatsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography
            textColor="shark_white"
            className="text-[22px] font-semibold"
          >
            Статистика аккаунта
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-3 auto-rows-auto gap-4 w-full h-full">
        <div className="flex flex-col gap-2 p-4 w-full bg-shark-950 rounded-lg">
          <Typography className="text-[18px] font-medium">
            Просмотров профиля
          </Typography>
          <Typography textColor="gray" className="text-[18px] font-medium">
            0&nbsp;
            <span className="ml-[2px] text-[14px] self-end">+0 за сегодня</span>
          </Typography>
        </div>
        {/*<div className="flex flex-col gap-2 p-4 w-full bg-shark-950 rounded-lg">*/}
        {/*  <Typography className="text-[18px] font-medium">*/}
        {/*    Просмотров профиля*/}
        {/*  </Typography>*/}
        {/*  <Typography textColor="gray" className="text-[18px] font-medium">*/}
        {/*    0 [+0 за сегодня]*/}
        {/*  </Typography>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
