import { ChangeEvent, useState } from "react";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Info } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { reatomComponent } from "@reatom/npm-react";
import { threadControlAtom } from "../models/thread-control.model";

type ThreadControlTitleProps = Pick<ThreadDetailed, "title">;

export const ThreadControlTitle = reatomComponent<ThreadControlTitleProps>(({
  ctx, title: currentTitle,
}) => {
  const [titleValue, setTitleValue] = useState<string>(currentTitle);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTitleValue(value);

    threadControlAtom(ctx, (prev) => ({
      state: {
        ...prev.state,
        isValid: value.length > 2,
      },
      values: { ...prev.values },
    }))
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
}, "ThreadControlTitle")
