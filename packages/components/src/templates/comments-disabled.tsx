import { Typography } from '@repo/ui/src/components/typography.tsx';

export const CommentsDisabled = () => {
  return (
    <div className="flex w-fit bg-white/10 justify-center self-center rounded-md px-2 py-0.5">
      <Typography textSize="medium" textColor="shark_white" className="font-semibold">
        Комментирование отключено
      </Typography>
    </div>
  );
};