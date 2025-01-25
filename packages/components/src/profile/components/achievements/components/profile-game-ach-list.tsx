import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
// @ts-ignore
import Duo from "@repo/assets/gifs/duo.gif";

type ProfileGameAchProps = Pick<UserEntity, "nickname">;

export const ProfileGameAch = ({ nickname }: ProfileGameAchProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/*<div className="flex w-full justify-between items-center">*/}
      {/*  <div className="flex items-center gap-1 w-fit">*/}
      {/*    <Typography*/}
      {/*      textColor="shark_white"*/}
      {/*      className="text-[22px] font-semibold"*/}
      {/*    >*/}
      {/*      Достижения {nickname}*/}
      {/*    </Typography>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
        <div className="flex flex-col items-center gap-y-4">
          <img src={Duo} alt="" width={196} height={196} />
          <Typography className="text-xl font-bold text-shark-50">
            В разработке
          </Typography>
        </div>
      </div>
    </div>
  );
};
