import { Typography } from "@repo/ui/src/components/typography.tsx";

export const TicketsMenu = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Тикеты / Помощь</Typography>
      <div className="flex flex-col gap-y-2 w-full"></div>
    </div>
  );
};
