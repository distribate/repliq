import { ChangeEvent, useState } from "react";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Info } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_CONTROL_QUERY_KEY, ThreadControlQuery } from "../queries/thread-control-query";

type ThreadControlTitleProps = Pick<ThreadDetailed, "title">;

export const ThreadControlTitle = ({
  title: currentTitle,
}: ThreadControlTitleProps) => {
  const qc = useQueryClient();
  const [titleValue, setTitleValue] = useState<string>(currentTitle);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTitleValue(value);

    return qc.setQueryData(
      THREAD_CONTROL_QUERY_KEY,
      (prev: ThreadControlQuery) => ({
        state: {
          ...prev.state,
          isValid: value.length > 2,
        },
        values: { ...prev.values },
      }),
    )
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex flex-col w-full pt-2 pb-1 border border-shark-700 rounded-md">
        <div className="flex items-center gap-1 px-4">
          <Typography textColor="gray">Название</Typography>
          <Info size={14} className="text-shark-300" />
        </div>
        <Input
          placeholder={currentTitle}
          roundedType="default"
          backgroundType="transparent"
          className="!text-[16px]"
          maxLength={64}
          value={titleValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
