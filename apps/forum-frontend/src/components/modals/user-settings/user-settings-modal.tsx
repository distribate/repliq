import { UserPersonalCard } from "#components/cards/user-personal-card/user-personal-card.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { ReactNode } from "react";
import { Typography } from "@repo/ui/src/components/typography";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu";
import { SlidersVertical } from 'lucide-react';

type UserSettingsModalProps =
  | { trigger: ReactNode }
  | { trigger?: never };

export const UserSettingsModal = ({
  trigger,
}: UserSettingsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        {trigger ? trigger : (
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="gap-2 group cursor-pointer"
          >
            <SlidersVertical size={20} className="text-shark-300" />
            <Typography textSize="medium">
              Настройки
            </Typography>
          </DropdownMenuItem>
        )}
      </DialogTrigger>
      <DialogContent>
        <UserPersonalCard />
      </DialogContent>
    </Dialog>
  );
};