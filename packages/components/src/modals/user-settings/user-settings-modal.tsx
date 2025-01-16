import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { UserPersonalCard } from "#cards/components/user-personal-card/user-personal-card.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { ReactNode } from "react";

type UserSettingsModalProps =
  | { trigger: ReactNode }
  | { trigger?: never };

export const UserSettingsModal = ({
  trigger,
}: UserSettingsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger ? trigger : <HoverCardItem>Настройки</HoverCardItem>}</DialogTrigger>
      <DialogContent>
        <UserPersonalCard />
      </DialogContent>
    </Dialog>
  );
};