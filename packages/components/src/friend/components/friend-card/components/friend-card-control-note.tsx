import { Pen } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useState } from "react";
import { FriendCardProps } from "#friend/components/friend-card/components/friend-card.tsx";
import { useControlFriend } from "#friend/components/friend-card/hooks/use-control-friend.ts";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Textarea } from "@repo/ui/src/components/textarea";

type FriendCardControlNote = Pick<FriendCardProps, "nickname"> & {
  friend_id: string;
};

export const FriendCardControlNote = ({
  nickname: recipient, friend_id
}: FriendCardControlNote) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { setFriendNoteMutation } = useControlFriend();

  const handleAddNote = () => {
    setFriendNoteMutation.mutate({ 
      recipient, friend_id, note: value.length < 1 ? "" : value
    });

    setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-default focus:bg-shark-600 hover:bg-shark-600 rounded-md">
        <div className="flex px-2 py-1.5 hover:bg-shark-700 rounded-md justify-start items-center gap-2 group">
          <Pen size={16} className="text-shark-300" />
          <Typography textSize="medium">
            Добавить заметку
          </Typography>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <Typography variant="dialogTitle">
            Заметка для {recipient}
          </Typography>
          <div className="flex flex-col gap-y-2 p-2 w-full">
            <Textarea
              value={value}
              maxLength={64}
              placeholder="Укажите заметку, например: должен сотку"
              onChange={(e) => setValue(e.target.value)}
              className="rounded-lg bg-shark-900 resize-none py-2 h-[56px] !text-[18px]"
            />
            <div className="flex w-full items-center justify-between gap-2">
              <Typography className="text-shark-300" textSize="small">
                {value.length} / 64
              </Typography>
              <div className="flex items-center gap-2 w-fit">
                <Button
                  variant="positive"
                  disabled={
                    setFriendNoteMutation.isPending || setFriendNoteMutation.isError
                  }
                  onClick={handleAddNote}
                >
                  <Typography>
                    Сохранить
                  </Typography>
                </Button>
                <DialogClose>
                  <Button variant="negative">
                    <Typography>
                      Отмена
                    </Typography>
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
