import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Pen } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Input } from "@repo/ui/src/components/input";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useState } from "react";
import { FriendCardProps } from "#friend/components/friend-card/components/friend-card.tsx";
import { useControlFriend } from "#friend/components/friend-card/hooks/use-control-friend.ts";

type FriendCardControlNote = Pick<FriendCardProps, "nickname"> & {
  friend_id: string;
};

export const FriendCardControlNote = ({
  nickname: recipient, friend_id
}: FriendCardControlNote) => {
  const [value, setValue] = useState<string>("");
  const { setFriendNoteMutation } = useControlFriend();

  const handleAddNote = () => {
    if (value.length <= 1) return;
    return setFriendNoteMutation.mutate({ recipient, friend_id, note: value });
  };

  return (
    <DropdownWrapper
      properties={{
        sideAlign: "right",
        contentAlign: "start",
        contentClassname: "w-[228px]",
      }}
      trigger={
        <DropdownMenuItem className="flex justify-start items-center gap-2 group">
          <Pen size={16} className="text-shark-300" />
          <Typography textSize="small">
            Добавить заметку
          </Typography>
        </DropdownMenuItem>
      }
      content={
        <div className="flex flex-col gap-y-2 w-full">
          <Input
            maxLength={32}
            type="text"
            value={value}
            placeholder="например: должен сотку"
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg !py-0.5 !px-2"
          />
          <div className="flex w-full items-center justify-end gap-2">
            <Typography className="text-shark-300" textSize="small">
              {value.length} / 32
            </Typography>
            <Button
              disabled={
                setFriendNoteMutation.isPending || setFriendNoteMutation.isError
              }
              onClick={handleAddNote}
              className="bg-shark-800 hover:bg-shark-700"
            >
              Сохранить
            </Button>
          </div>
        </div>
      }
    />
  );
};
