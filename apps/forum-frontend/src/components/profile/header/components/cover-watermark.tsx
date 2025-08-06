import { Typography } from "@repo/ui/src/components/typography.tsx";

const WatermarkItem = () => {
  return (
    <div className="flex space-x-4 justify-between *:opacity-20 *:text-[26px] *:whitespace-nowrap">
      <Typography textColor="gray">Repliq</Typography>
      <Typography textColor="gray">Repliq </Typography>
      <Typography textColor="gray">Repliq</Typography>
      <Typography textColor="gray">Repliq </Typography>
      <Typography textColor="gray">Repliq</Typography>
      <Typography textColor="gray">Repliq </Typography>
      <Typography textColor="gray">Repliq </Typography>
      <Typography textColor="gray">Repliq</Typography>
      <Typography textColor="gray">Repliq </Typography>
    </div >
  );
};

export const UserCoverWatermark = () => {
  return (
    <div
      className="z-[3] space-y-16 opacity-60 select-none pointer-events-none
        -translate-y-[64px] absolute justify-between -translate-x-[64px]
        -rotate-[6deg] w-full h-full top-0 *:w-full bottom-0"
    >
      <WatermarkItem />
      <WatermarkItem />
      <WatermarkItem />
      <WatermarkItem />
      <WatermarkItem />
      <WatermarkItem />
    </div>
  );
};